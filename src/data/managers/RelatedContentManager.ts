import { useQuery } from '@tanstack/react-query'
import { ConnectionTypeManager, getValidConnectionType, EMPTY_WORKS, EMPTY_CONNECTION_TYPE_COUNTS, ExternalConnectionCounts } from './ConnectionTypeManager'
import { PaginationManager, EMPTY_PAGINATION } from './PaginationManager'
import { useDoiRelatedContentQuery } from 'src/data/queries/doiRelatedContentQuery'
import { useConnectionCounts } from './ConnectionCountManager'
import { ConnectionTypeCounts, Pagination, Works, Work } from 'src/data/types'
import { QueryData, fetchDoi } from 'src/data/queries/doiQuery'
import { QueryVar } from 'src/data/queries/searchDoiQuery'
import { isDMP, isProject } from 'src/utils/helpers'

export class RelatedContentManager {
  private readonly data: QueryData | undefined
  private readonly loading: boolean
  private readonly error: Error | undefined | null
  private readonly connectionManager: ConnectionTypeManager | null
  private readonly paginationManager: PaginationManager | null
  private readonly connectionType: string
  private readonly facetsLoading: boolean
  private readonly connectionCounts: ExternalConnectionCounts | undefined
  private readonly primaryWork: Work | undefined

  constructor(connectionType: string | undefined, data: QueryData | undefined, loading: boolean, error: Error | undefined | null, facetsLoading: boolean, connectionCounts?: ExternalConnectionCounts, primaryWork?: Work) {
    this.data = data
    this.loading = loading
    this.facetsLoading = facetsLoading
    this.error = error
    this.connectionType = getValidConnectionType(connectionType)
    this.connectionCounts = connectionCounts
    this.primaryWork = primaryWork

    if (data?.work) {
      this.connectionManager = new ConnectionTypeManager(data.work, connectionCounts)
      const { works } = this.connectionManager.getWorksAndTitle(connectionType)
      this.paginationManager = new PaginationManager(works)
    } else {
      this.connectionManager = null
      this.paginationManager = null
    }
  }

  get isLoading() : boolean {
    return this.loading
  }

  get facetsAreLoading() : boolean {
    return this.facetsLoading
  }

  get hasError() : boolean {
    return !!this.error
  }

  get errorMessage() : string | undefined {
    return this.error?.message
  }

  get hasData() : boolean {
    return !!this.data
  }

  get hasAnyRelatedWorks() : boolean {
    return this.connectionManager?.hasAnyRelatedWorks() || false
  }

  get showSankey() : boolean {
    return this.primaryWork ? (isDMP(this.primaryWork) || isProject(this.primaryWork)) : false
  }

  get connectionTypeCounts(): ConnectionTypeCounts {
    // If we have connection counts from the dedicated hook, use them
    if (this.connectionCounts?.counts) {
      return this.connectionCounts.counts
    }
    // Otherwise fall back to the connection manager's counts
    return this.connectionManager?.getCounts() || EMPTY_CONNECTION_TYPE_COUNTS
  }

  get connectionCountsLoading() : boolean {
    return this.connectionCounts?.isLoading || false
  }

  get connectionCountsError() : boolean {
    return this.connectionCounts?.isError || false
  }

  get selectedContent() : {works: Works, title: string} {
    if (!this.connectionManager) return {works: EMPTY_WORKS, title: ''}
    return this.connectionManager.getWorksAndTitle(this.connectionType)
  }

  get pagination() : Pagination {
    if (!this.paginationManager) return EMPTY_PAGINATION
    return {
      hasPagination: this.paginationManager.hasPagination,
      hasNextPage: this.paginationManager.hasNextPage,
      endCursor: this.paginationManager.endCursor
    }
  }
}

function extractRelatedDois(work: Work | undefined): string[] {
  if (!work) return []
  
  // Check if relatedIdentifiers exists on the work object (even if not in the type)
  const workWithRelatedIdentifiers = work as any
  if (!workWithRelatedIdentifiers?.relatedIdentifiers) return []
  
  return workWithRelatedIdentifiers.relatedIdentifiers
    .filter((identifier: any) => identifier.relatedIdentifierType === 'DOI')
    .map((identifier: any) => identifier.relatedIdentifier)
    .filter(Boolean) // Remove any undefined/null values
}

export function useRelatedContentManager(
  doi: string,
  vars: QueryVar
) {
  // Fetch primary work
  const doiQuery = useQuery({
    queryKey: ['doi', doi],
    queryFn: () => fetchDoi(doi),
    enabled: !!doi,
  })
  
  const primaryWork = doiQuery.data?.data?.work
  const relatedDois = extractRelatedDois(primaryWork)
  
  // Merge related DOIs with existing variables as uidList
  const varsWithRelatedDois = {
    ...vars,
    uidList: relatedDois
  }
  
  // Fetch related content
  const { loading, data, error, facetsLoading } = useDoiRelatedContentQuery(varsWithRelatedDois)
  const connectionCounts = useConnectionCounts(varsWithRelatedDois)
  
  return new RelatedContentManager(
    varsWithRelatedDois.connectionType,
    data,
    loading || doiQuery.isLoading,
    error || doiQuery.error,
    facetsLoading,
    connectionCounts,
    primaryWork
  )
}
