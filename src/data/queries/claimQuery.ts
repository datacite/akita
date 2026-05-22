import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Claim } from 'src/data/types'

export const claimKeys = {
  all: ['claim'] as const,
  detail: (doi: string) => [...claimKeys.all, doi] as const,
}

export interface QueryData {
  work: {
    id: string
    registrationAgency: { id: string }
    claims: Claim[]
  }
}

export interface QueryVar {
  id: string
}

export interface MutationResponse {
  claim: Claim | null
  errors: Array<{ status?: number; source?: string; title: string }> | null
}

async function fetchClaim(doi: string): Promise<QueryData> {
  const response = await fetch(`/claims?doi=${encodeURIComponent(doi)}`)
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || 'Failed to fetch claim')
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].message || 'Failed to fetch claim')
  }

  return json
}

async function createClaimRequest(doi: string, sourceId: string): Promise<MutationResponse> {
  const response = await fetch('/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doi, sourceId }),
  })
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || 'Failed to create claim')
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].message || 'Failed to create claim')
  }

  return json
}

async function deleteClaimRequest(id: string): Promise<MutationResponse> {
  const response = await fetch(`/claims/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error || 'Failed to delete claim')
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].message || 'Failed to delete claim')
  }

  return json
}

function updateClaimInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  doiId: string,
  updatedClaim: Claim
) {
  queryClient.setQueryData<QueryData>(claimKeys.detail(doiId), (existing) => {
    if (!existing?.work) return existing

    const claims = existing.work.claims.length > 0
      ? existing.work.claims.map((claim) =>
          claim.id === updatedClaim.id ? updatedClaim : claim
        )
      : [updatedClaim]

    return { work: { ...existing.work, claims } }
  })
}

export function useClaimQuery(variables: QueryVar) {
  const { data, error, isPending, refetch } = useQuery({
    queryKey: claimKeys.detail(variables.id),
    queryFn: () => fetchClaim(variables.id),
    refetchInterval: (query) => {
      const claim = query.state.data?.work?.claims?.[0]
      return claim?.state === 'waiting' ? 10000 : false
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
