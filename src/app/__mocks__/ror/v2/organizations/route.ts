import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Only enable this mock endpoint when running tests
function mocksEnabled(): boolean {
  return process.env.CYPRESS_NODE_ENV === 'test'
}

const FIXTURE_DIR = path.resolve(process.cwd(), 'cypress/mocks/ror/v2/organizations')

export async function GET(request: Request) {
  if (!mocksEnabled()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('query') || ''
    const query = rawQuery.toLowerCase()

    // 1) Try to serve a file named after the query value
    //    e.g., index.query=cambridge.json or index.query=ror.org%2F052gg0110.json
    const encoded = encodeURIComponent(query)
    const candidateByQuery = `index.query=${encoded}.json`
    const candidatePath = path.join(FIXTURE_DIR, candidateByQuery)
    try {
      const json = await fs.readFile(candidatePath, 'utf-8')
      return new NextResponse(json, {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    } catch (e) {
      // No matching query fixture; fall through to other strategies
      void e
    }

    // 2) If the query looks like a ROR ID (e.g., ror.org/052gg0110), wrap its detail into a search result
    if (query.startsWith('ror.org/')) {
      const id = query.split('/').pop() || ''
      if (id) {
        try {
          const orgJson = await fs.readFile(path.join(FIXTURE_DIR, `${id}.json`), 'utf-8')
          const org = JSON.parse(orgJson)
          const response = {
            items: [org],
            number_of_results: 1,
            meta: { types: [], countries: [] }
          }
          return NextResponse.json(response, { status: 200 })
        } catch (e) {
          // Missing detail fixture; fall through to empty result
          void e
        }
      }
    }

    // 3) Fallback: empty result
    return NextResponse.json({ items: [], number_of_results: 0, meta: { types: [], countries: [] } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Fixture not found' }, { status: 404 })
  }
}


