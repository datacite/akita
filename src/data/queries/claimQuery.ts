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

async function fetchClaim(doi: string): Promise<QueryData> {
  const response = await fetch(`/claims?doi=${encodeURIComponent(doi)}`)
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || json.errors?.[0]?.title || 'Failed to fetch claim')
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].title || 'Failed to fetch claim')
  }

  return normalizeQueryData(json)
}

async function createClaimRequest(doi: string, sourceId: string): Promise<ClaimMutationResult> {
  const response = await fetch('/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doi, sourceId }),
  })
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || json.errors?.[0]?.title || 'Failed to create claim')
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].title || 'Failed to create claim')
  }

  return normalizeMutationResult(json)
}

async function deleteClaimRequest(id: string): Promise<ClaimMutationResult> {
  const response = await fetch(`/claims/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || json.errors?.[0]?.title || 'Failed to delete claim')
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].title || 'Failed to delete claim')
  }

  return normalizeMutationResult(json)
}

function updateClaimInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  doiId: string,
  updatedClaim: Claim
) {
  queryClient.setQueryData<QueryData>(claimKeys.detail(doiId), (existing) => {
    if (!existing) return existing

    if (!existing.claims || existing.claims.length === 0) {
      return { claims: [updatedClaim] }
    }

    let replaced = false
    const claims = existing.claims.map((claim) => {
      if (claim.id === updatedClaim.id) {
        replaced = true
        return updatedClaim
      }
      return claim
    })

    return { claims: replaced ? claims : [...claims, updatedClaim] }
  })
}

export function useClaimQuery(variables: QueryVar) {
  const { data, error, isPending, refetch } = useQuery({
    queryKey: claimKeys.detail(variables.id),
    queryFn: () => fetchClaim(variables.id),
    refetchInterval: (query) => {
      const claim = query.state.data?.claims?.[0]
      return claim?.state === 'waiting' ? 2000 : false
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
      if (result.claim) {
        updateClaimInCache(queryClient, doiId, result.claim)
      }
    },
  })
}

export function useDeleteClaimMutation(doiId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteClaimRequest(id),
    onSuccess: (result) => {
      if (result.claim) {
        updateClaimInCache(queryClient, doiId, result.claim)
      }
    },
  })
}
