import { MultilevelFacet } from 'src/data/types'
import type { SankeyGraphData } from './SankeySpec'

export function multilevelToSankey(facets: MultilevelFacet[] | undefined): SankeyGraphData[] {
  if (!facets) return []
  const outerMap = new Map<SankeyGraphData['data'][0], Map<SankeyGraphData['data'][1], SankeyGraphData['count']>>()
  facets = facets.filter(f => f.title)

  facets.forEach(facet => {
    facet.inner.forEach(i => {
      const outerKey = facet.title
      const innerKey = i.title
      const count = i.count

      let innerMap = outerMap.get(outerKey)

      if (!innerMap) {
        innerMap = new Map<SankeyGraphData['data'][1], SankeyGraphData['count']>()
        outerMap.set(outerKey, innerMap)
      }

      const previousCount = innerMap.get(innerKey) || 0
      const totalCount = count + previousCount
      innerMap.set(innerKey, totalCount)
    })
  })

  const data: SankeyGraphData[] = []

  outerMap.forEach((innerMap, outerKey) => {
    innerMap.forEach((count, innerKey) => {
      data.push({ data: [outerKey, innerKey], count })
    })
  })

  return data
}
