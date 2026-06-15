import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from 'src/utils/auth'
import { deleteClaim } from 'src/utils/dataciteClaims'

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
