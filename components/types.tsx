export interface DoiType {
  id: string
  doi: string
  url: string
  types: {
    resourceTypeGeneral: string
    resourceType: string
  }
  creators: Creator[]
  titles: Title[]
  publicationYear: number
  publisher: string
  descriptions: Description[]
  rights: Rights[]
  version: string
  formattedCitation: string
  citationCount: number
  citationsOverTime: CitationsYear[]
  citations: []
  viewCount: number
  viewsOverTime: UsageMonth[]
  views: []
  downloadCount: number
  downloadsOverTime: UsageMonth[]
  downloads: []
}

export interface Creator {
  id: string
  name: string
  givenName: string
  familyName: string
}

interface Title {
  title: string
}

export interface Rights {
  rights: string
  rightsUri: string
}

interface Description {
  description: string
}

interface CitationsYear {
  year: string,
  total: number
}

interface UsageMonth {
  yearMonth: string,
  total: number
}
