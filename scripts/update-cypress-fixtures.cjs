#!/usr/bin/env node
/**
 * Refresh Cypress fixtures from live stage/sandbox APIs.
 *
 * Usage:
 *   yarn fixtures:update
 *   yarn fixtures:update:dry
 *   yarn fixtures:update:one -- --fixture=orcid/expanded-search-hallett.json
 *   yarn fixtures:list
 */
const fs = require('fs')
const path = require('path')

const { manifest } = require('../cypress/fixtureManifest.cjs')

const fixturesRoot = path.join(process.cwd(), 'cypress', 'fixtures')

/** @param {string} envPath */
function loadDotEnv(envPath) {
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] == null) process.env[key] = value
  }
}

loadDotEnv(path.join(process.cwd(), '.env'))

/** @param {string[]} argv */
function parseArgs(argv) {
  const options = {
    dryRun: false,
    list: false,
    fixture: null,
    group: null,
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--list') options.list = true
    else if (arg === '--fixture') options.fixture = argv[++i]
    else if (arg.startsWith('--fixture=')) options.fixture = arg.slice('--fixture='.length)
    else if (arg === '--group') options.group = argv[++i]
    else if (arg.startsWith('--group=')) options.group = arg.slice('--group='.length)
  }

  return options
}

/** @param {typeof manifest[number]} entry */
function resolveUrl(entry) {
  if (entry.getUrl) return entry.getUrl(process.env)
  return entry.url
}

/** @param {typeof manifest[number]} entry */
function matchesFilter(entry, options) {
  if (options.fixture && !entry.fixture.includes(options.fixture)) return false
  if (options.group && !entry.fixture.startsWith(`${options.group}/`)) return false
  return true
}

/** @param {typeof manifest[number]} entry @param {string} body */
function writeFixture(entry, body) {
  const filePath = path.join(fixturesRoot, entry.fixture)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })

  if (entry.contentType === 'text') {
    fs.writeFileSync(filePath, body)
    return
  }

  const parsed = JSON.parse(body)
  fs.writeFileSync(filePath, `${JSON.stringify(parsed, null, 2)}\n`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const entries = manifest.filter((entry) => matchesFilter(entry, options))

  if (options.list) {
    for (const entry of entries) {
      const updatable = entry.updatable !== false
      const url = updatable ? resolveUrl(entry) : '(static — not updatable)'
      console.log(`${entry.fixture}\t${updatable ? 'updatable' : 'static'}\t${url}`)
    }
    return
  }

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const entry of entries) {
    if (entry.updatable === false) {
      console.log(`skip (static): ${entry.fixture}`)
      skipped++
      continue
    }

    const url = resolveUrl(entry)
    if (!url) {
      console.error(`fail (no url): ${entry.fixture}`)
      failed++
      continue
    }

    if (options.dryRun) {
      console.log(`would update: ${entry.fixture}\n  ${url}`)
      continue
    }

    try {
      const response = await fetch(url, {
        method: entry.method || 'GET',
        headers: entry.headers,
      })

      const expectedStatus = entry.expectStatus ?? 200
      if (response.status !== expectedStatus) {
        throw new Error(`HTTP ${response.status}, expected ${expectedStatus}`)
      }

      const body = await response.text()
      writeFixture(entry, body)
      console.log(`updated: ${entry.fixture}`)
      updated++
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`fail: ${entry.fixture} — ${message}`)
      failed++
    }
  }

  if (!options.dryRun) {
    console.log(`\nSummary: ${updated} updated, ${skipped} skipped, ${failed} failed`)
  }

  if (failed > 0) process.exit(1)
}

main()
