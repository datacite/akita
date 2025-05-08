import { ConnectionTypeManager, getValidConnectionType, EMPTY_WORKS, EMPTY_CONNECTION_TYPE_COUNTS } from './ConnectionTypeManager'
import { PaginationManager, EMPTY_PAGINATION } from './PaginationManager'
import { useDoiRelatedContentQueryGQL } from 'src/data/queries/doiRelatedContentQuery'
import { isDMP, isProject } from 'src/utils/helpers'
import { ApolloError } from '@apollo/client'

export class RelatedContentManager {
  private readonly data: any
  private readonly loading: boolean
  private readonly error: ApolloError | undefined
  private readonly connectionManager: ConnectionTypeManager | null
  private readonly paginationManager: PaginationManager | null
  private readonly connectionType: string
  private readonly vars: any

  constructor(vars: any, connectionType: string | undefined, data: any, loading: boolean, error: ApolloError | undefined) {
    this.vars = vars
    this.data = data
    this.loading = loading
    this.error = error
    this.connectionType = getValidConnectionType(connectionType)

    if (data?.work) {
      this.connectionManager = new ConnectionTypeManager(data.work)
      const { works } = this.connectionManager.getWorksAndTitle(connectionType)
      this.paginationManager = new PaginationManager(works)
    } else {
      this.connectionManager = null
      this.paginationManager = null
    }
  }

  get isLoading() {
    return this.loading
  }

  get hasError() {
    return !!this.error
  }

  get errorMessage() {
    return this.error?.message
  }

  get hasData() {
    return !!this.data
  }

  get hasAnyRelatedWorks() {
    return this.connectionManager?.hasAnyRelatedWorks() || false
  }

  get showSankey() {
    return this.data?.work ? (isDMP(this.data.work) || isProject(this.data.work)) : false
  }

  get connectionTypeCounts() {
    return this.connectionManager?.getCounts() || EMPTY_CONNECTION_TYPE_COUNTS
  }

  get selectedContent() {
    if (!this.connectionManager) return {works: EMPTY_WORKS, title: ''}
    return this.connectionManager.getWorksAndTitle(this.connectionType)
  }

  get pagination() {
    if (!this.paginationManager) return EMPTY_PAGINATION
    return {
      hasPagination: this.paginationManager.hasPagination,
      hasNextPage: this.paginationManager.hasNextPage,
      endCursor: this.paginationManager.endCursor
    }
  }

  getUrl() {
    return '/doi.org/b/' + this.vars.id + '/?'
  }
}

export function useRelatedContentManager(vars: any, connectionType: string | undefined) {
  const { loading, data, error } = useDoiRelatedContentQueryGQL(vars)
  return new RelatedContentManager(vars, connectionType, data, loading, error)
}
