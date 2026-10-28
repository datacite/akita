import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from 'src/utils/auth'
import { deleteClaim, getClaim } from 'src/utils/dataciteClaims'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Claim id is required' }, { status: 400 })
  }

  const auth = await getAuthSession()
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const result = await getClaim(id, auth.token)
    if (result.errors?.length) {
      return NextResponse.json({ claims: [], errors: result.errors }, { status: 200 })
    }
    return NextResponse.json({ claims: result.claim ? [result.claim] : [] })
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json({ error: 'Failed to fetch claim' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Claim id is required' }, { status: 400 })
  }

  const auth = await getAuthSession()
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const result = await deleteClaim(id, auth.token)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting claim:', error)
    return NextResponse.json({ error: 'Failed to delete claim' }, { status: 500 })
  }
}
