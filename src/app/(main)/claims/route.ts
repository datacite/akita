import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from 'src/utils/auth'
import { getClaims, createClaim } from 'src/utils/dataciteClaims'

export async function GET(request: NextRequest) {
  const doi = request.nextUrl.searchParams.get('doi')
  if (!doi) {
    return NextResponse.json({ error: 'doi query parameter is required' }, { status: 400 })
  }

  const auth = await getAuthSession()
  // Mirror the DataCite GraphQL behavior: unauthenticated users see no claims.
  if (!auth) {
    return NextResponse.json({ claims: [] })
  }

  try {
    const result = await getClaims(doi, auth.uid, auth.token)

    if (result.errors?.length) {
      return NextResponse.json({ errors: result.errors }, { status: 200 })
    }

    return NextResponse.json({ claims: result.claims })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { doi, sourceId } = body as { doi?: string; sourceId?: string }
  if (!doi || !sourceId) {
    return NextResponse.json({ error: 'doi and sourceId are required' }, { status: 400 })
  }

  const auth = await getAuthSession()
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const result = await createClaim(doi, sourceId, auth.uid, auth.token)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating claim:', error)
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 })
  }
}
