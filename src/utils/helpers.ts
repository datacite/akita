import { NumberFormat, toLocaleString } from '@formatjs/intl-numberformat'
NumberFormat.__addLocaleData(
  require('@formatjs/intl-numberformat/dist/locale-data/en.json') // locale-data for en
)

export const compactNumbers = (num: number) => {
  if (num >= 1e3)
    return toLocaleString(num, 'en', {
      notation: 'compact',
      compactDisplay: 'short'
    })
  return num.toString()
}

export const pluralize = (val: number, word: string, plural:string = word + 's') => {
  const uncountable = ['Software']
  const resultNumber = (typeof val == 'number') ? val.toLocaleString('en-US') + ' ' : ''
  const resultString = (val === 1 || uncountable.includes(word)) ? word : plural
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
