import { describe, expect, it } from 'vitest'
import { appendFacets, buildQuery, type QueryVar } from './searchDoiQuery'

const DOI = '10.5281/zenodo.123'
const ROR = 'https://ror.org/021nxhr62'

function facetParams(variables: QueryVar): Record<string, string> {
  const params = new URLSearchParams()
  appendFacets(variables, params)
  return Object.fromEntries(params.entries())
}

describe('buildQuery', () => {
  it('returns an empty string when nothing is set', () => {
    expect(buildQuery({})).toBe('')
  })

  describe('user query', () => {
    it('wraps the user query in parentheses', () => {
      expect(buildQuery({ query: 'climate' })).toBe('(climate)')
    })

    it('keeps a top-level OR grouped when facets are ANDed on', () => {
      expect(buildQuery({ query: 'climate OR ocean', language: 'en' }))
        .toBe('(climate OR ocean) AND language:en')
    })

    it('ANDs filterQuery onto the query exactly once', () => {
      const query = buildQuery({ query: 'climate', filterQuery: 'ocean OR sea' })
      expect(query).toBe('(climate) AND (ocean OR sea)')
    })

    it('skips an empty user query', () => {
      expect(buildQuery({ query: '', language: 'en' })).toBe('language:en')
    })
  })

  describe('related DOI connection types', () => {
    it('uses version_ids (not versions_ids) for versionOf', () => {
      expect(buildQuery({ relatedDoi: DOI, connectionType: 'versionOf' }))
        .toBe(`(version_ids:"${DOI}")`)
    })

    it('maps each single connection type to its relation field', () => {
      const cases: Record<string, string> = {
        references: 'citation_ids',
        citations: 'reference_ids',
        parts: 'part_of_ids',
        partOf: 'part_ids',
        versions: 'version_of_ids',
        versionOf: 'version_ids',
      }
      for (const [connectionType, field] of Object.entries(cases)) {
        expect(buildQuery({ relatedDoi: DOI, connectionType })).toBe(`(${field}:"${DOI}")`)
      }
    })

    it('never emits the non-existent versions_ids field', () => {
      for (const connectionType of ['allRelated', 'otherRelated', 'versionOf']) {
        expect(buildQuery({ relatedDoi: DOI, connectionType, uidList: ['10.1/a'] }))
          .not.toContain('versions_ids')
      }
    })

    it('includes version_ids in allRelated and in the otherRelated exclusion', () => {
      const all = buildQuery({ relatedDoi: DOI, connectionType: 'allRelated' })
      expect(all).toContain(`version_ids:"${DOI}"`)

      const other = buildQuery({ relatedDoi: DOI, connectionType: 'otherRelated' })
      const [, negative] = other.split(' AND NOT ')
      expect(negative).toContain(`version_ids:"${DOI}"`)
    })

    it('adds the uid list to allRelated', () => {
      expect(buildQuery({ relatedDoi: DOI, uidList: ['10.1/a', '10.1/b'] }))
        .toContain('uid:("10.1/a" OR "10.1/b")')
    })

    it('ignores an unknown connection type', () => {
      expect(buildQuery({ relatedDoi: DOI, connectionType: 'bogus' })).toBe('')
    })
  })

  describe('organization relation types', () => {
    it('builds allRelated across all six organization fields', () => {
      expect(buildQuery({ rorId: ROR })).toBe(
        '(organization_id:ror.org/021nxhr62 OR provider.ror_id:"https://ror.org/021nxhr62"' +
        ' OR affiliation_id:ror.org/021nxhr62 OR related_dmp_organization_id:ror.org/021nxhr62' +
        ' OR funder_rors:"https://ror.org/021nxhr62" OR funder_parent_rors:"https://ror.org/021nxhr62")'
      )
    })

    it('builds createdBy and affiliatedResearcher as Lucene', () => {
      expect(buildQuery({ rorId: ROR, organizationRelationType: 'createdBy' }))
        .toBe('(organization_id:ror.org/021nxhr62 OR provider.ror_id:"https://ror.org/021nxhr62")')
      expect(buildQuery({ rorId: ROR, organizationRelationType: 'affiliatedResearcher' }))
        .toBe('(affiliation_id:ror.org/021nxhr62)')
    })

    it('emits no Lucene for fundedBy (it is sent as REST params)', () => {
      expect(buildQuery({ rorId: ROR, organizationRelationType: 'fundedBy' })).toBe('')
      expect(buildQuery({ rorId: ROR, organizationRelationType: 'fundedBy', query: 'ocean' }))
        .toBe('(ocean)')
    })

    it('falls back to allRelated for an unknown relation type', () => {
      expect(buildQuery({ rorId: ROR, organizationRelationType: 'bogus' }))
        .toBe(buildQuery({ rorId: ROR }))
    })
  })
})

describe('appendFacets', () => {
  it('sends funded-by with child organizations for the fundedBy relation', () => {
    expect(facetParams({ rorId: ROR, organizationRelationType: 'fundedBy' })).toEqual({
      'funded-by': '021nxhr62',
      'include-funder-child-organizations': 'true',
    })
  })

  it('accepts a bare or ror.org-prefixed ROR id', () => {
    expect(facetParams({ rorId: 'ror.org/021nxhr62', organizationRelationType: 'fundedBy' })['funded-by'])
      .toBe('021nxhr62')
    expect(facetParams({ rorId: '021nxhr62', organizationRelationType: 'fundedBy' })['funded-by'])
      .toBe('021nxhr62')
  })

  it('does not send funded-by for other relation types or without a ROR id', () => {
    for (const organizationRelationType of ['allRelated', 'createdBy', 'affiliatedResearcher', undefined]) {
      expect(facetParams({ rorId: ROR, organizationRelationType })).not.toHaveProperty('funded-by')
    }
    expect(facetParams({ organizationRelationType: 'fundedBy' })).not.toHaveProperty('funded-by')
  })

  it('combines funded-by with the existing filter params', () => {
    expect(facetParams({
      rorId: ROR,
      organizationRelationType: 'fundedBy',
      clientId: 'cern.zenodo',
      published: '2024',
    })).toEqual({
      published: '2024',
      'client-id': 'cern.zenodo',
      'funded-by': '021nxhr62',
      'include-funder-child-organizations': 'true',
    })
  })
})
