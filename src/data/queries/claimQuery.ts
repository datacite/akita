import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Claim, ClaimMutationResult } from 'src/data/types'

export const claimKeys = {
  all: ['claim'] as const,
  detail: (doi: string, claimUid?: string | null) => [...claimKeys.all, doi, claimUid ?? 'list'] as const,
}

export interface QueryData {
  claims: Claim[]
}

export interface QueryVar {
  id: string
  claimUid: string | null
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

async function fetchClaim(doi: string, claimUid: string | null): Promise<QueryData> {
  const url = claimUid ? `/claims/${encodeURIComponent(claimUid)}` : `/claims?doi=${encodeURIComponent(doi)}`
  const response = await fetch(url)
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
    queryKey: claimKeys.detail(variables.id, variables.claimUid),
    queryFn: () => fetchClaim(variables.id, variables.claimUid),
    // When switching from the DOI list lookup to the /claims/[id] lookup, keep showing the
    // claim we already have instead of dropping back to a loading state.
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === variables.id ? previousData : undefined,
    refetchInterval: (query) => {
      const claim = query.state.data?.claims?.[0]
      return claim?.state === 'waiting' || claim?.state === 'working' ? 500 : false
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
    onSuccess: async (result) => {
      if (result.claim) {
        // Seed the detail entry the component reads once it knows the claim ID, whether
        // the create returned the existing claim ID or a new one.
        queryClient.setQueryData<QueryData>(
          claimKeys.detail(doiId, result.claim.id),
          { claims: [result.claim] }
        )
      }
      // Refetch whatever claim query is on screen so it reflects the server's state.
      await queryClient.invalidateQueries({ queryKey: [...claimKeys.all, doiId] })
    },
  })
}
