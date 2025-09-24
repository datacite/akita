import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

function mocksEnabled(): boolean {
  return process.env.USE_MOCKS === 'true' || process.env.CYPRESS_NODE_ENV === 'test'
}

const FIXTURE_DIR = path.resolve(process.cwd(), 'cypress/mocks/ror/v2/organizations')
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!mocksEnabled()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  try {
    const { id } = await params
    const filename = `${id}.json`
    const filePath = path.join(FIXTURE_DIR, filename)
    const json = await fs.readFile(filePath, 'utf-8')
    return new NextResponse(json, {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Fixture not found' }, { status: 404 })
  }
}


