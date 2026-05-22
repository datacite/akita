import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from 'src/utils/auth'
import {
  CREATE_CLAIM_MUTATION,
  dataciteGraphql,
  GET_CLAIM_QUERY,
} from 'src/utils/dataciteGraphql'
import type { Claim } from 'src/data/types'

interface GetClaimResponse {
  work: {
    id: string
    registrationAgency: { id: string }
    claims: Claim[]
  }
}

interface MutationResponse {
  claim: Claim | null
  errors: Array<{ status?: number; source?: string; title: string }> | null
}

interface CreateClaimGraphqlResponse {
  createClaim: MutationResponse
}

export async function GET(request: NextRequest) {
  const doi = request.nextUrl.searchParams.get('doi')
  if (!doi) {
    return NextResponse.json({ error: 'doi query parameter is required' }, { status: 400 })
  }

  try {
    const token = getAuthToken()
    const result = await dataciteGraphql<GetClaimResponse>(
      GET_CLAIM_QUERY,
      { id: doi },
      token
    )

    if (result.errors?.length) {
      return NextResponse.json({ errors: result.errors }, { status: 200 })
    }

    if (!result.data?.work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json({ error: 'Failed to fetch claim' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let body: { doi?: string; sourceId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { doi, sourceId } = body
  if (!doi || !sourceId) {
    return NextResponse.json({ error: 'doi and sourceId are required' }, { status: 400 })
  }

  try {
    const token = getAuthToken()
    const result = await dataciteGraphql<CreateClaimGraphqlResponse>(
      CREATE_CLAIM_MUTATION,
      { doi, sourceId },
      token
    )

    if (result.errors?.length) {
      return NextResponse.json({ errors: result.errors }, { status: 200 })
    }

    const payload = result.data?.createClaim ?? { claim: null, errors: null }
    return NextResponse.json(payload)
  } catch (error) {
    console.error('Error creating claim:', error)
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 })
  }
}
