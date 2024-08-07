import '@formatjs/intl-numberformat/polyfill'
import '@formatjs/intl-numberformat/locale-data/en'
import { WorkMetadata } from 'src/data/types'

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
    work.types.resourceType === 'Project' &&
    (work.types.resourceTypeGeneral === 'Other' ||
      work.types.resourceTypeGeneral === 'Text')
  )
}

export function isAwardGrant(work: WorkMetadata) {
  return (
    (work.types.resourceType === 'Award' ||
      work.types.resourceType === 'Grant') &&
    (work.types.resourceTypeGeneral === 'Other' ||
      work.types.resourceTypeGeneral === 'Text')
  )
}
