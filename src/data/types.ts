// DOI types
export type WorkMetadata = {
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

export type Work = WorkMetadata & {
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
  allRelated?: Works
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
  repositories?: Facet[]
  affiliations?: Facet[]
  funders: Facet[]
  authors?: Facet[]
  creatorsAndContributors?: Facet[]
  clients?: Facet[]
  clientTypes?: Facet[]
  citations?: Facet[]
  views?: Facet[]
  downloads?: Facet[]
  citationCount?: number
  viewCount?: number
  downloadCount?: number
  totalContentUrl?: number
  totalOpenLicenses?: number
  openLicenseResourceTypes?: Facet[]

  nodes: Work[]
  personToWorkTypesMultilevel: MultilevelFacet[]
}

type Title = {
  title: string
}

type Description = {
  description: string
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
  rightsIdentifierScheme?: string
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

// Organization types
export type OrganizationMetadata = {
  name: string
}

export type Organization = OrganizationMetadata & {
  id: string
  memberId: string
  memberRoleId: string
  alternateName: string[]
  inceptionYear: number
  types: string[]
  url: string
  wikipediaUrl: string
  twitter: string
  citationCount: number
  viewCount: number
  downloadCount: number
  geolocation: Geolocation
  country: Country
  identifiers: OrganizationIdentifier[]
  works: Works
}

export type Organizations = {
  totalCount: number
  pageInfo: PageInfo
  types: Facet[]
  countries: Facet[]
  nodes: Organization[]
}

type Geolocation = {
  pointLongitude: number
  pointLatitude: number
}

type OrganizationIdentifier = {
  identifier: string
  identifierType: string
}

// People types
export type PersonMetadata = {
  id: string
  name: string
  description: string
}

export interface Person extends PersonMetadata {
  links: Link[]
  identifiers: Identifier[]
  country: Country
  givenName: string
  familyName: string
  alternateName: string[]
  citationCount: number
  viewCount: number
  downloadCount: number
  employment: EmploymentRecord[]
  pageInfo: PageInfo
  totalWorks: PersonWorks
  works: PersonWorks
}

export interface People {
  __typename: String
  totalCount: number
  pageInfo: PageInfo
  nodes: Person[]
}

interface Link {
  name: string
  url: string
}

export interface EmploymentRecord {
  organizationId: string
  organizationName: string
  roleTitle: string
  startDate: Date
  endDate: Date
}

interface PersonWorks extends Works {
  totalContentUrl: number
  totalOpenLicenses: number
  openLicenseResourceTypes: Facet[]
}

// Repository types
export type RepositoryMetadata = {
  id: string
  name: string
  re3doi: string
}

export type Repository = RepositoryMetadata & {
  clientId: string
  name: string
  language: string[]
  description: string
  type: string
  repositoryType: string[]
  url: string
  keyword: string[]
  subject: { text: string }[]
  re3dataUrl: string

  citationCount: number
  downloadCount: number
  viewCount: number
  works: RepositoryWorks
  contact: string[]
  pidSystem: string[]
  providerType: string[]
  dataUpload: TextRestriction[]
  dataAccess: TextRestriction[]
  certificate: string[]
}

export interface Repositories {
  totalCount: number
  pageInfo: PageInfo
  certificates: [RepositoryFacet]
  software: [RepositoryFacet]
  nodes: Repository[]
}

interface RepositoryWorks {
  totalCount: number
  languages: Facet[]
  resourceTypes: Facet[]
  fieldsOfScience: Facet[]
  authors: Facet[]
  licenses: Facet[]
  published: Facet[]
}

interface RepositoryFacet extends Facet {
  name: string
}

interface TextRestriction {
  type: string
}

// Shared types
type Identifier = {
  identifier: string
  identifierType: string
  identifierUrl: string
}

export type Facet = {
  id: string
  title: string
  count: number
  tooltipText?: string
}

export type MultilevelFacet = Facet & {
  inner: Facet[]
}

type Country = {
  id: string
  name: string
}

export type PageInfo = {
  endCursor: string
  hasNextPage: boolean
}

export type FormattedCitation = {
  id: string
  formattedCitation: string
}
