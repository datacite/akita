import { Work, Works, ConnectionTypeCounts } from 'src/data/types'



export type ConnectionType = keyof ConnectionTypeCounts

export const DEFAULT_CONNECTION_TYPE = 'allRelated'

export const EMPTY_CONNECTION_TYPE_COUNTS: ConnectionTypeCounts = {
  allRelated: 0,
  references: 0,
  citations: 0,
  parts: 0,
  partOf: 0,
  versions: 0,
  versionOf: 0,
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

// Derive connection types from the counts object to maintain single source of truth
export const CONNECTION_TYPES = Object.keys(EMPTY_CONNECTION_TYPE_COUNTS) as ConnectionType[]

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

export type ExternalConnectionCounts = {
  counts: ConnectionTypeCounts
  isLoading: boolean
  isError: boolean
  errors: unknown[]
}

export class ConnectionTypeManager {
  private counts: ConnectionTypeCounts
  private readonly work: Work
  private readonly externalCounts?: ExternalConnectionCounts

  constructor(work: Work, externalCounts?: ExternalConnectionCounts) {
    this.work = work
    this.externalCounts = externalCounts
    this.counts = this.calculateCounts()
  }

  private calculateCounts(): ConnectionTypeCounts {
    // If external counts are provided, use them
    if (this.externalCounts?.counts) {
      return this.externalCounts.counts
    }
    
    // Otherwise calculate from work data
    return {
      allRelated: this.work.allRelated?.totalCount || 0,
      references: this.work.references?.totalCount || 0,
      citations: this.work.citations?.totalCount || 0,
      parts: this.work.parts?.totalCount || 0,
      partOf: this.work.partOf?.totalCount || 0,
      versions: this.work.versions?.totalCount || 0,
      versionOf: this.work.versionOf?.totalCount || 0,
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
    const { allRelated, references, citations, parts, partOf, versions, versionOf } = this.counts
    if (allRelated > 0) return 'allRelated'
    if (references > 0) return 'references'
    if (citations > 0) return 'citations'
    if (parts > 0) return 'parts'
    if (partOf > 0) return 'partOf'
    if (versions > 0) return 'versions'
    if (versionOf > 0) return 'versionOf'
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
