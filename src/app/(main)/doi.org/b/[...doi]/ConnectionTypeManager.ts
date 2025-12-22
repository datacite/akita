import { Work, Works } from 'src/data/types'

export type ConnectionTypeCounts = {
  allRelated: number
  references: number
  citations: number
  parts: number
  partOf: number
  otherRelated: number
}

export type ConnectionType = keyof ConnectionTypeCounts
// enumerated list of connectionTypes
export const CONNECTION_TYPES: ConnectionType[] = ['allRelated', 'references', 'citations', 'parts', 'partOf', 'otherRelated']
export const DEFAULT_CONNECTION_TYPE = 'allRelated'

export const EMPTY_CONNECTION_TYPE_COUNTS: ConnectionTypeCounts = {
  allRelated: 0,
  references: 0,
  citations: 0,
  parts: 0,
  partOf: 0,
  otherRelated: 0
}

export const EMPTY_WORKS: Works = {
  totalCount: 0,
  nodes: [],
  pageInfo: {
    hasNextPage: false,
    endCursor: ""
  }
}

export function isConnectionType(connectionType: string): boolean {
  return CONNECTION_TYPES.includes(connectionType as ConnectionType)
}

export function getValidConnectionType(connectionType: string | undefined ): string {
    let validConnectionType = DEFAULT_CONNECTION_TYPE
    if (connectionType && isConnectionType(connectionType)) {
      validConnectionType = connectionType
    }
    return validConnectionType
}

export class ConnectionTypeManager {
  private counts: ConnectionTypeCounts
  private readonly work: Work

  constructor(work: Work) {
    this.work = work
    this.counts = this.calculateCounts()
  }

  private calculateCounts(): ConnectionTypeCounts {
    return {
      allRelated: this.work.allRelated?.totalCount || 0,
      references: this.work.references?.totalCount || 0,
      citations: this.work.citations?.totalCount || 0,
      parts: this.work.parts?.totalCount || 0,
      partOf: this.work.partOf?.totalCount || 0,
      otherRelated: this.work.otherRelated?.totalCount || 0
    }
  }

  getCounts(): ConnectionTypeCounts {
    return this.counts
  }

  hasAnyRelatedWorks(): boolean {
    return Object.values(this.counts).some(count => count > 0)
  }


  getDefaultConnectionType(): string {
    const { allRelated, references, citations, parts, partOf } = this.counts
    if (allRelated > 0) return 'allRelated'
    if (references > 0) return 'references'
    if (citations > 0) return 'citations'
    if (parts > 0) return 'parts'
    if (partOf > 0) return 'partOf'
    return 'otherRelated'
  }

  formatTitle(connectionType: string): string {
    if (connectionType === 'allRelated') return 'All Related Works'
    if (connectionType === 'otherRelated') return 'Other Works'
    return connectionType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  getWorks(connectionType: string): Works {
    connectionType = getValidConnectionType(connectionType)
    const works = this.work[connectionType] as Works | undefined;
    return works ?? EMPTY_WORKS
  }

  getWorksAndTitle(connectionType: string | undefined ): { works: Works, title: string } {
    const validConnectionType = getValidConnectionType(connectionType)
    const works = this.getWorks(validConnectionType)
    const title = this.formatTitle(validConnectionType)
    return { works, title }
  }
}
