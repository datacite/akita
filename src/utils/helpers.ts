import '@formatjs/intl-numberformat/polyfill'
import '@formatjs/intl-numberformat/locale-data/en'
import ISO6391 from 'iso-639-1'
import ISO31661 from 'iso-3166-1'
import type { Facet, WorkMetadata, Person } from 'src/data/types'
import type { HorizontalBarRecord } from 'src/components/HorizontalStackedBarChart/HorizontalStackedBarChart'
import { DOI_ID_BASE } from 'src/data/constants'

export const compactNumbers = (num: number, compact: boolean = false) => {
  let options = {}
  if (compact && num >= 1e3)
    options = { notation: 'compact', compactDisplay: 'short' }
  return num.toLocaleString('en-US', options)
}

export const pluralize = (
  val: number,
  word: string,
  compact: boolean = false,
  plural: string = word + 's'
) => {
  const uncountable = ['Software']
  const resultNumber =
    typeof val == 'number' ? compactNumbers(val, compact) + ' ' : ''
  const resultString = val === 1 || uncountable.includes(word) ? word : plural
  return resultNumber + resultString
}

export const doiFromUrl = (doiUrl: string) => {
  return doiUrl ? doiUrl.substring(15) : null
}

export const orcidFromUrl = (orcidUrl: string) => {
  return orcidUrl ? orcidUrl.substring(17) : null
}

export const rorFromUrl = (rorUrl: string) => {
  return rorUrl ? rorUrl.substring(15) : null
}

export const gridFromUrl = (gridUrl: string) => {
  return gridUrl ? gridUrl.substring(15) : null
}

export function isDMP(work: WorkMetadata) {
  return work.types.resourceTypeGeneral === 'OutputManagementPlan'
}

export function isProject(work: WorkMetadata) {
  return (
    (work.types.resourceType === 'Project' &&
      (work.types.resourceTypeGeneral === 'Other' ||
        work.types.resourceTypeGeneral === 'Text')) ||
    work.types.resourceTypeGeneral === 'Project'
  )
}

function getTotalCount(sum: number, data: HorizontalBarRecord) { return sum + data.count }

export function getTopFive(data: HorizontalBarRecord[]) {
  if (data.length === 0) {
    return {
      data: [],
      topCategory: "",
      topPercent: -1
    }
  }

  const otherData = data.filter(d => d.title === "Other")
  let otherCount = otherData.reduce(getTotalCount, 0)

  const missingData = data.filter(d => d.title === "Missing")
  const missingCount = missingData.reduce(getTotalCount, 0)

  data = data.filter(d => d.title !== "Other" && d.title !== "Missing")
  const sorted = data.sort((a, b) => b.count - a.count)

  const topFive = sorted.slice(0, 5)
  const others = sorted.slice(5)
  otherCount += others.reduce(getTotalCount, 0)

  if (otherCount > 0)
    topFive.push({ title: 'Other', count: otherCount })

  if (missingCount > 0)
    topFive.push({ title: 'Missing', count: missingCount })


  topFive.sort((a, b) => b.count - a.count)[0]

  return {
    data: topFive,
    topCategory: topFive[0].title,
    topPercent: Math.round(topFive[0].count / topFive.reduce(getTotalCount, 0) * 100)
  }
}

export function toBarRecord(data: Facet) {
  return { title: data.title, count: data.count }
}




export function extractFOS(subjects: any) {
  const fos = subjects
    .filter((s) => s.subject.startsWith('FOS: '))
    .map(({ subject: s }) => ({ id: kebabify(s.slice(5)), name: s.slice(5) }))

  const uniqueFOS = Array.from(new Set(fos.map((f) => f.id))).map((id) =>
    fos.find((f) => f.id === id)
  )
  return uniqueFOS
}

export function mapPeople(people: any[]) {
  return people.map((p) => {
    return {
      ...p,
      affiliation: p.affiliation.map((a) => ({
        ...a,
        id: a.affiliationIdentifier
      })),
      id: p.nameIdentifiers[0]?.nameIdentifier || ''
    }
  })
}


function kebabify(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert a dash between lowercase and uppercase letters
    .toLowerCase()
}

export function titleCase(input: string): string {
  return input
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}



interface Repository {
  id: string
  attributes: {
    name: string
  }
}



export function mapJsonToWork(json: any, included: any[]) {
  const attrs = json.attributes
  const repo =
    json.relationships.client.data && included
      ? included.find(
        (r: Repository) => r.id === json.relationships.client.data.id
      ) || null
      : null

  return {
    ...attrs,
    id: DOI_ID_BASE + json.id,
    language: { id: attrs.language, name: ISO6391.getName(attrs.language) },
    rights: attrs.rightsList,
    creators: mapPeople(attrs.creators),
    contributors: mapPeople(attrs.contributors),
    fieldsOfScience: extractFOS(attrs.subjects),
    registrationAgency: {
      id: attrs.agency,
      name: REGISTRATION_AGENCIES[attrs.agency]
    },
    repository: repo
      ? { id: repo.id, name: repo.attributes.name }
      : { id: '', name: '' },
    schemaOrg: ''
  }
}

export function getDateFromParts(year?: number, month = 1, day = 1): string | null {
  if (!year) return null;
  return new Date(year, month - 1, day).toISOString();
}

export function buildPersonName(names: { 'orcid-id': string, 'given-names': string, 'family-names': string, 'credit-name': string }) {
  const id = names['orcid-id'], givenName = names['given-names'], familyName = names['family-names'], creditName = names['credit-name']

  return creditName ? creditName :
    (givenName || familyName) ? [givenName, familyName].join(' ') :
      id
}

export function mapSearchJsonToPerson(json: any): Person {
  return {
    id: 'https://orcid.org/' + json['orcid-id'],
    name: buildPersonName(json),
    givenName: json['given-names'],
    familyName: json['family-names'],
    alternateName: json['other-name']
  } as Person
}

export function getCountryName(countryCode: string) {
  const isoentry = ISO31661.whereAlpha2(countryCode.toUpperCase())
  return isoentry ? isoentry.country : ""
}


const REGISTRATION_AGENCIES = {
  airiti: 'Airiti',
  cnki: 'CNKI',
  crossref: 'Crossref',
  datacite: 'DataCite',
  istic: 'ISTIC',
  jalc: 'JaLC',
  kisti: 'KISTI',
  medra: 'mEDRA',
  op: 'OP'
}
