import { PaginationManager, EMPTY_PAGINATION } from './PaginationManager'
import { EMPTY_WORKS } from './ConnectionTypeManager'
import { useOrganizationRelatedContentQuery } from 'src/data/queries/organizationRelatedContentQuery'
import { Pagination, Works } from 'src/data/types'
import { QueryData } from 'src/data/queries/organizationRelatedContentQuery'
import { QueryVar } from 'src/data/queries/searchDoiQuery'

const VALID_ORGANIZATION_RELATION_TYPES = ['allRelated', 'fundedBy', 'createdBy', 'affiliatedResearcher', 'dmp'] as const

function formatOrganizationRelationTitle(organizationRelationType: string): string {
  const type = organizationRelationType || 'allRelated'
  if (!VALID_ORGANIZATION_RELATION_TYPES.includes(type as typeof VALID_ORGANIZATION_RELATION_TYPES[number])) {
    return 'All related'
  }
  switch (type) {
    case 'allRelated':
      return 'All related'
    case 'fundedBy':
      return 'Funded by'
    case 'createdBy':
      return 'Created by'
    case 'affiliatedResearcher':
      return 'Affiliated researcher'
    case 'dmp':
      return 'DMP'
    default:
      return 'All related'
  }
}

export class OrganizationRelatedContentManager {
  private readonly data: QueryData | undefined
  private readonly loading: boolean
  private readonly error: Error | undefined | null
  private readonly organizationRelationType: string
  private readonly facetsLoading: boolean
  private readonly paginationManager: PaginationManager
  private readonly works: Works

  constructor(
    organizationRelationType: string | undefined,
    data: QueryData | undefined,
    loading: boolean,
    error: Error | undefined | null,
    facetsLoading: boolean
  ) {
    this.data = data
    this.loading = loading
    this.error = error
    this.organizationRelationType = organizationRelationType || 'allRelated'
    this.facetsLoading = facetsLoading
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
    return this.works.totalCount > 0
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

export function useOrganizationRelatedContentManager(rorId: string, vars: QueryVar) {
  const { loading, data, error, facetsLoading } = useOrganizationRelatedContentQuery(vars)
  const organizationRelationType = vars.organizationRelationType
  return new OrganizationRelatedContentManager(
    organizationRelationType,
    data,
    loading,
    error ?? undefined,
    facetsLoading ?? false
  )
}
