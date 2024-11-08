import '@formatjs/intl-numberformat/polyfill'
import '@formatjs/intl-numberformat/locale-data/en'
import type { Facet, WorkMetadata } from 'src/data/types'
import type { HorizontalBarRecord } from 'src/components/HorizontalStackedBarChart/HorizontalStackedBarChart'

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




