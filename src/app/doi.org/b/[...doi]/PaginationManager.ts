interface PageInfo {
  hasNextPage?: boolean
  endCursor?: string
}

interface WorksWithPagination {
  totalCount: number
  pageInfo?: PageInfo
}

export class PaginationManager {
  private readonly works: WorksWithPagination
  private readonly itemsPerPage: number

  constructor(works: WorksWithPagination, itemsPerPage: number = 25) {
    this.works = works
    this.itemsPerPage = itemsPerPage
  }

  get hasNextPage(): boolean {
    return this.works.pageInfo?.hasNextPage || false
  }

  get hasPagination(): boolean {
    return this.works.totalCount > this.itemsPerPage
  }

  get endCursor(): string {
    return this.works.pageInfo?.endCursor || ''
  }
}
