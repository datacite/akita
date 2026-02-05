import { PaginationManager } from './PaginationManager'
import { EMPTY_WORKS } from './ConnectionTypeManager'
import { useOrganizationConnectionCounts } from './OrganizationConnectionCountManager'
import { useOrganizationRelatedContentQuery } from 'src/data/queries/organizationRelatedContentQuery'
import { OrganizationRelationTypeCounts, Pagination, Works } from 'src/data/types'
import { QueryData } from 'src/data/queries/organizationRelatedContentQuery'
import { QueryVar, VALID_ORGANIZATION_RELATION_TYPES } from 'src/data/queries/searchDoiQuery'

type OrganizationRelationType = typeof VALID_ORGANIZATION_RELATION_TYPES[number]

const EMPTY_ORGANIZATION_RELATION_TYPE_COUNTS: OrganizationRelationTypeCounts = VALID_ORGANIZATION_RELATION_TYPES.reduce(
  (acc, type) => {
    acc[type] = 0
    return acc
  },
  {} as OrganizationRelationTypeCounts
)

const ORGANIZATION_RELATION_TYPE_TITLES: Record<OrganizationRelationType, string> = {
  allRelated: 'All Related',
  affiliatedResearcher: 'By Affiliated Researchers',
  createdBy: 'Created By',
  fundedBy: 'Funded By',
}

export const ORGANIZATION_RELATION_TYPE_FACETS: { id: OrganizationRelationType; title: string }[] = VALID_ORGANIZATION_RELATION_TYPES.map(
  (type) => ({
    id: type,
    title: ORGANIZATION_RELATION_TYPE_TITLES[type]
  })
)

function getValidOrganizationRelationType(organizationRelationType: string | undefined): OrganizationRelationType {
  if (!organizationRelationType) return 'allRelated'
  return VALID_ORGANIZATION_RELATION_TYPES.includes(organizationRelationType as OrganizationRelationType)
    ? (organizationRelationType as OrganizationRelationType)
    : 'allRelated'
}

function formatOrganizationRelationTitle(organizationRelationType: string | undefined): string {
  const type = getValidOrganizationRelationType(organizationRelationType)
  return ORGANIZATION_RELATION_TYPE_TITLES[type]
}

export type ExternalOrganizationCounts = {
  counts: OrganizationRelationTypeCounts
  isLoading: boolean
  isError: boolean
}

export class OrganizationRelatedContentManager {
  private readonly data: QueryData | undefined
  private readonly loading: boolean
  private readonly error: Error | undefined | null
  private readonly organizationRelationType: string
  private readonly facetsLoading: boolean
  private readonly organizationCounts: ExternalOrganizationCounts | undefined
  private readonly paginationManager: PaginationManager
  private readonly works: Works

  constructor(
    organizationRelationType: string | undefined,
    data: QueryData | undefined,
    loading: boolean,
    error: Error | undefined | null,
    facetsLoading: boolean,
    organizationCounts?: ExternalOrganizationCounts
  ) {
    this.data = data
    this.loading = loading
    this.error = error
    this.organizationRelationType = getValidOrganizationRelationType(organizationRelationType)
    this.facetsLoading = facetsLoading
    this.organizationCounts = organizationCounts
    this.works = data?.organization?.works ?? EMPTY_WORKS
    this.paginationManager = new PaginationManager(this.works)
  }

  get isLoading(): boolean {
    return this.loading
  }

  get facetsAreLoading(): boolean {
    return this.facetsLoading
  }

  get hasError(): boolean {
    return !!this.error
  }

  get errorMessage(): string | undefined {
    return this.error?.message
  }

  get hasData(): boolean {
    return !!this.data
  }

  get hasAnyRelatedWorks(): boolean {
    if (this.works.totalCount > 0) return true
    return Object.values(this.organizationRelationTypeCounts).some(count => count > 0)
  }

  get organizationRelationTypeCounts(): OrganizationRelationTypeCounts {
    return this.organizationCounts?.counts ?? EMPTY_ORGANIZATION_RELATION_TYPE_COUNTS
  }

  get organizationCountsLoading(): boolean {
    return this.organizationCounts?.isLoading ?? false
  }

  get selectedContent(): { works: Works; title: string } {
    const title = formatOrganizationRelationTitle(this.organizationRelationType)
    return { works: this.works, title }
  }

  get pagination(): Pagination {
    return {
      hasPagination: this.paginationManager.hasPagination,
      hasNextPage: this.paginationManager.hasNextPage,
      endCursor: this.paginationManager.endCursor
    }
  }
}

export function useOrganizationRelatedContentManager(vars: QueryVar) {
  const { loading, data, error, facetsLoading } = useOrganizationRelatedContentQuery(vars)
  const organizationCounts = useOrganizationConnectionCounts(vars)
  const organizationRelationType = vars.organizationRelationType
  return new OrganizationRelatedContentManager(
    organizationRelationType,
    data,
    loading,
    error ?? undefined,
    facetsLoading ?? false,
    {
      counts: organizationCounts.counts,
      isLoading: organizationCounts.isLoading,
      isError: organizationCounts.isError
    }
  )
}
