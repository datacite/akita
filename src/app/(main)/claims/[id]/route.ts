import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from 'src/utils/auth'
import { dataciteGraphql, DELETE_CLAIM_MUTATION } from 'src/utils/dataciteGraphql'
import type { Claim } from 'src/data/types'

interface MutationResponse {
  claim: Claim | null
  errors: Array<{ status?: number; source?: string; title: string }> | null
}

interface DeleteClaimGraphqlResponse {
  deleteClaim: MutationResponse
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Claim id is required' }, { status: 400 })
  }

  try {
    const token = getAuthToken()
    const result = await dataciteGraphql<DeleteClaimGraphqlResponse>(
      DELETE_CLAIM_MUTATION,
      { id },
      token
    )

    if (result.errors?.length) {
      return NextResponse.json({ errors: result.errors }, { status: 200 })
    }

    const payload = result.data?.deleteClaim ?? { claim: null, errors: null }
    return NextResponse.json(payload)
  } catch (error) {
    console.error('Error deleting claim:', error)
    return NextResponse.json({ error: 'Failed to delete claim' }, { status: 500 })
  }
}
