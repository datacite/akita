import { DATACITE_API_URL } from 'src/data/constants'
import type { Claim, ClaimError, ClaimMutationResult } from 'src/data/types'

interface ClaimResource {
  id: string
  attributes: {
    sourceId: string
    state: string
    claimAction: string | null
    claimed: string | null
    errorMessages: ClaimError[]
  }
}

interface ClaimsListResponse {
  data?: ClaimResource[]
  errors?: ClaimError[]
}

interface ClaimResponse {
  data?: ClaimResource
  errors?: ClaimError[]
}

const DEFAULT_TIMEOUT_MS = 5000

function toClaim(resource: ClaimResource): Claim {
  return {
    id: resource.id,
    sourceId: resource.attributes.sourceId,
    state: resource.attributes.state,
    claimAction: resource.attributes.claimAction,
    claimed: resource.attributes.claimed
      ? new Date(resource.attributes.claimed)
      : null,
    errorMessages: resource.attributes.errorMessages ?? [],
  }
}

async function claimsFetch(
  path: string,
  token: string,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(`${DATACITE_API_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`DataCite claims request timed out after ${timeoutMs}ms`)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function getClaims(
  doi: string,
  uid: string,
  token: string
): Promise<{ claims: Claim[]; errors: ClaimError[] | null }> {
  const params = new URLSearchParams({
    'user-id': uid,
    dois: doi.toLowerCase(),
  })
  const response = await claimsFetch(`/claims?${params.toString()}`, token)

  if (!response.ok) {
    let errors: ClaimError[] | null = null
    try {
      const json: ClaimsListResponse = await response.json()
      errors = json.errors ?? null
    } catch {
      // non-JSON error body
    }
    return {
      claims: [],
      errors: errors ?? [{ title: `Failed to fetch claims: ${response.status}` }],
    }
  }

  try {
    const json: ClaimsListResponse = await response.json()
    return { claims: (json.data ?? []).map(toClaim), errors: null }
  } catch {
    return { claims: [], errors: [{ title: 'Failed to fetch claims: invalid response' }] }
  }
}

export async function createClaim(
  doi: string,
  sourceId: string,
  uid: string,
  token: string
): Promise<ClaimMutationResult> {
  const body = {
    claim: {
      uuid: crypto.randomUUID(),
      orcid: uid,
      doi,
      claim_action: 'create',
      source_id: sourceId,
    },
  }

  const response = await claimsFetch('/claims', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    body: JSON.stringify(body),
  })

  if (response.status !== 202) {
    let errors: ClaimError[] | null = null
    try {
      const json: ClaimResponse = await response.json()
      errors = json.errors ?? null
    } catch {
      // non-JSON error body
    }
    return {
      claim: null,
      errors: errors ?? [{ status: response.status, title: 'Failed to create claim' }],
    }
  }

  try {
    const json: ClaimResponse = await response.json()
    if (!json.data) {
      return {
        claim: null,
        errors: json.errors ?? [{ status: response.status, title: 'Failed to create claim' }],
      }
    }
    return { claim: toClaim(json.data), errors: null }
  } catch {
    return {
      claim: null,
      errors: [{ status: response.status, title: 'Failed to create claim: invalid response' }],
    }
  }
}

export async function deleteClaim(id: string, token: string): Promise<ClaimMutationResult> {
  const response = await claimsFetch(`/claims/${encodeURIComponent(id)}`, token, {
    method: 'DELETE',
  })

  if (![200, 202, 204].includes(response.status)) {
    let errors: ClaimError[] | null = null
    try {
      const json: ClaimResponse = await response.json()
      errors = json.errors ?? null
    } catch {
      // non-JSON error body
    }
    return {
      claim: null,
      errors: errors ?? [{ status: response.status, title: 'Failed to delete claim' }],
    }
  }

  if (response.status === 204) {
    return { claim: null, errors: null }
  }

  try {
    const json: ClaimResponse = await response.json()
    return { claim: json.data ? toClaim(json.data) : null, errors: null }
  } catch {
    return { claim: null, errors: null }
  }
}
