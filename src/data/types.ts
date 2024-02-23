// DOI types
export type Work = {
  id: string
  doi: string
  url: string
  identifiers?: Identifier[]
  contentUrl: string
  types: {
    resourceTypeGeneral?: string
    resourceType?: string
  }

  titles: Title[]
  creators: Creator[]
  publicationYear: number
  publisher: string
  container?: {
    identifier: string
    identifierType: string
    title: string
  }
  descriptions?: Description[]
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
  
  registrationAgency: {
    id: string
    name: string
  }
  registered?: Date
  formattedCitation?: string
  schemaOrg: string
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

type Rights = {
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

type FundingReference = {
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
