import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Claim, ClaimMutationResult } from 'src/data/types'

export const claimKeys = {
  all: ['claim'] as const,
  detail: (doi: string) => [...claimKeys.all, doi] as const,
}

export interface QueryData {
  claims: Claim[]
}

export interface QueryVar {
  id: string
}

/** Claim shape as returned by JSON.parse (dates are ISO strings). */
type ClaimJson = Omit<Claim, 'claimed'> & { claimed: string | null }

function normalizeClaim(raw: ClaimJson): Claim {
  return {
    ...raw,
    claimed: raw.claimed ? new Date(raw.claimed) : null,
  }
}

function normalizeQueryData(json: { claims?: ClaimJson[] }): QueryData {
  return { claims: (json.claims ?? []).map(normalizeClaim) }
}

function normalizeMutationResult(json: ClaimMutationResult & { claim?: ClaimJson | null }): ClaimMutationResult {
  return {
    ...json,
    claim: json.claim ? normalizeClaim(json.claim) : null,
  }
}

function throwIfApiError(response: Response, json: any, fallbackMessage: string): void {
  if (!response.ok) {
    throw new Error(json.error || json.errors?.[0]?.title || fallbackMessage)
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].title || fallbackMessage)
  }
}

// Always look claims up by DOI (volpino's OpenSearch-backed list endpoint). Volpino's
// /claims/:id lookup is unindexed on claims.uuid and currently takes ~30s.
async function fetchClaim(doi: string): Promise<QueryData> {
  const response = await fetch(`/claims?doi=${encodeURIComponent(doi)}`)
  const json = await response.json()

  throwIfApiError(response, json, `Failed to fetch claim (${response.status} ${response.statusText})`)

  return normalizeQueryData(json)
}

async function createClaimRequest(doi: string, sourceId: string): Promise<ClaimMutationResult> {
  const response = await fetch('/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doi, sourceId }),
  })
  const json = await response.json()

  throwIfApiError(response, json, `Failed to create claim (${response.status} ${response.statusText})`)

  return normalizeMutationResult(json)
}

export function useClaimQuery(variables: QueryVar) {
  const { data, error, isPending, refetch } = useQuery({
    queryKey: claimKeys.detail(variables.id),
    queryFn: () => fetchClaim(variables.id),
    refetchInterval: (query) => {
      const claim = query.state.data?.claims?.[0]
      return claim?.state === 'waiting' || claim?.state === 'working' ? 2000 : false
    },
  })

  return {
    loading: isPending,
    data,
    error: error ?? null,
    refetch,
  }
}

export function useCreateClaimMutation(doiId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ doi, sourceId }: { doi: string; sourceId: string }) =>
      createClaimRequest(doi, sourceId),
    onSuccess: (result) => {
      // Show the accepted (`waiting`) claim straight away and let polling take it from there.
      // Don't refetch immediately: volpino reindexes OpenSearch asynchronously, so the list
      // endpoint may still return the previous `done` claim.
      if (result.claim) {
        queryClient.setQueryData<QueryData>(claimKeys.detail(doiId), { claims: [result.claim] })
      }
    },
  })
}
