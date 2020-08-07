import { NumberFormat, toLocaleString } from '@formatjs/intl-numberformat'
NumberFormat.__addLocaleData(
  require('@formatjs/intl-numberformat/dist/locale-data/en.json') // locale-data for en
)

export const compactNumbers = (num) => {
  if (num >= 1e3)
    return toLocaleString(num, 'en', {
      notation: 'compact',
      compactDisplay: 'short'
    })
  return num
}

export const orcidFromUrl = (orcidUrl: string) => {
  if (!orcidUrl) {
    return null
  }
  const url = document.createElement('a')
  url.href = orcidUrl
  return url.pathname
}

export const doiFromUrl = (doiUrl: string) => {
  if (!doiUrl) {
    return null
  }
  const url = document.createElement('a')
  url.href = doiUrl
  return url.pathname
}

export const rorFromUrl = (rorUrl: string) => {
  if (!rorUrl) {
    return null
  }

  const url = document.createElement('a')
  url.href = rorUrl
  return url.pathname
}
