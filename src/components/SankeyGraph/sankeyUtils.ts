import { MultilevelFacet } from 'src/data/types'

export type SankeyNodeKind = 'person' | 'others' | 'type'

export interface SankeyGraphNode {
  name: string
  /** ORCID URL for people, resource type id (e.g. "dataset") for types. */
  id: string
  kind: SankeyNodeKind
}

export interface SankeyGraphLink {
  source: number
  target: number
  value: number
}

export interface SankeyGraphData {
  nodes: SankeyGraphNode[]
  links: SankeyGraphLink[]
}

export const MAX_PEOPLE = 10
export const OTHER_CONTRIBUTORS = 'Other contributors'

const totalOf = (facet: MultilevelFacet) =>
  facet.count || facet.inner.reduce((sum, i) => sum + i.count, 0)

// Turns the person -> work type facet into Recharts' { nodes, links } shape.
// People beyond the top `maxPeople` are merged into one "Other contributors"
// node so the chart stays readable. Node keys are prefixed so a person whose
// name matches a work type never collapses into it.
export function multilevelToSankey(
  facets: MultilevelFacet[] | undefined,
  maxPeople = MAX_PEOPLE
): SankeyGraphData {
  const nodes: SankeyGraphNode[] = []
  const indexByKey = new Map<string, number>()
  const values = new Map<string, number>()

  const nodeIndex = (key: string, node: SankeyGraphNode) => {
    let index = indexByKey.get(key)
    if (index === undefined) {
      index = nodes.push(node) - 1
      indexByKey.set(key, index)
    }
    return index
  }

  const people = (facets ?? [])
    .filter(f => f.title && f.inner.length > 0)
    .sort((a, b) => totalOf(b) - totalOf(a))

  const hasOthers = people.length > maxPeople
  const shown = hasOthers ? people.slice(0, maxPeople - 1) : people

  people.forEach((person, i) => {
    const source = i < shown.length
      ? nodeIndex(`person:${person.id || person.title}`, { name: person.title, id: person.id, kind: 'person' })
      : nodeIndex('others', { name: OTHER_CONTRIBUTORS, id: '', kind: 'others' })

    person.inner.forEach(type => {
      if (!type.title || type.count <= 0) return
      const target = nodeIndex(`type:${type.id || type.title}`, { name: type.title, id: type.id, kind: 'type' })
      const key = `${source}->${target}`
      values.set(key, (values.get(key) ?? 0) + type.count)
    })
  })

  const links: SankeyGraphLink[] = []
  values.forEach((value, key) => {
    const [source, target] = key.split('->').map(Number)
    links.push({ source, target, value })
  })

  return { nodes, links }
}
