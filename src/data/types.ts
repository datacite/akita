// DOI types
export type Metadata = {
  id: string
  doi: string
  types: {
    resourceTypeGeneral?: string
    resourceType?: string
  }
  creators: Creator[]
  titles: Title[]
  descriptions: Description[]
  registrationAgency: {
    id: string
    name: string
  }
  schemaOrg: string
}

export type Work = Metadata & {
  url: string
  identifiers?: Identifier[]
  contentUrl: string

  publicationYear: number
  publisher: Publisher
  container?: {
    identifier: string
    identifierType: string
    title: string
  }
  fieldsOfScience?: FieldOfScience[]

  rights?: Rights[]
  version?: string
  language?: {
    id: string
    name: string
  }
  repository?: {
    id: string
    name: string
  }
  
  registered?: Date
  formattedCitation?: string
  claims?: Claim[]
  contributors?: Contributor[]
  fundingReferences?: FundingReference[]

  citationCount?: number
  citations?: Works
  viewCount?: number
  viewsOverTime?: UsageMonth[]
  downloadCount?: number
  downloadsOverTime?: UsageMonth[]
  references?: Works
  parts?: Works
  partOf?: Works
  otherRelated?: Works
}


export type Works = {
  totalCount: number
  pageInfo: PageInfo
  published: Facet[]
  resourceTypes: Facet[]
  languages: Facet[]
  licenses: Facet[]
  fieldsOfScience: Facet[]
  registrationAgencies: Facet[]
  nodes: Work[]
  personToWorkTypesMultilevel: MultilevelFacet[]
}



type Title = {
  title: string
}

type Description = {
  description: string
}

type Identifier = {
  identifier: string
  identifierType: string
  identifierUrl: string
}

type Publisher = {
  name: string
  publisherIdentifier: string
  publisherIdentifierScheme: string
  schemeUri: string
  lang: string
}

export type Rights = {
  rights: string
  rightsUri: string
  rightsIdentifier: string
}


type Creator = {
  id: string
  name: string
  givenName: string
  familyName: string
  affiliation: Affiliation[]
}

type Contributor = {
  id: string
  name: string
  givenName: string
  familyName: string
  contributorType: string
  affiliation: Affiliation[]
}

type Affiliation = {
  id: string
  name: string
}

export type FundingReference = {
  funderIdentifier?: string
  funderIdentifierType?: string
  funderName?: string
  awardUri?: string
  awardTitle?: string
  awardNumber?: string
}

export type Claim = {
  id: string
  sourceId: string
  state: string
  claimAction: string
  claimed: Date
  errorMessages: ClaimError[]
}

interface ClaimError {
  status?: number
  title: string
}

type FieldOfScience = {
  id: string
  name: string
}

type UsageMonth = {
  yearMonth: string
  total: number
}



export type Facet = {
  id: string
  title: string
  count: number
}

type MultilevelFacet = Facet & {
  inner: Facet[]
}

type PageInfo = {
  endCursor: string
  hasNextPage: boolean
}
