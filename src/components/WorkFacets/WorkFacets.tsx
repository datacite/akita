'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBox from '../SearchBox/SearchBox'
import AuthorsFacet from '../AuthorsFacet/AuthorsFacet'
import { Work, Facet } from 'src/data/types'
import FacetList from '../FacetList/FacetList'
import FacetListGroup from '../FacetList/FacetListGroup'

interface Props {
  data: Facets
  model: string
  url: string
  connectionTypesCounts?: { references: number, citations: number, parts: number, partOf: number, otherRelated: number, allRelated: number, versions: number, versionOf: number }
}

interface Facets {
  published?: Facet[]
  resourceTypes?: Facet[]
  languages?: Facet[]
  licenses?: Facet[]
  repositories?: Facet[]
  affiliations?: Facet[]
  fieldsOfScience?: Facet[]
  registrationAgencies?: Facet[]
  authors?: Facet[]
  creatorsAndContributors?: Facet[]
  clientTypes?: Facet[]
  nodes: Work[]
}

function removeOtherAndMissing(facet: Facet) {
  return facet.id !== '__other__' && facet.id !== '__missing__'
}

export default function WorkFacets({
  data,
  model,
  url,
  connectionTypesCounts
}: Props) {

  // get current query parameters from next router
  const searchParams = useSearchParams()

  // remove %2F? at the end of url
  const path = url.substring(0, url.length - 2)

  const connectionTypeList: Facet[] = connectionTypesCounts ? [
    { id: 'allRelated', title: 'All', count: connectionTypesCounts.allRelated },
    { id: 'references', title: 'References', count: connectionTypesCounts.references },
    { id: 'citations', title: 'Citations', count: connectionTypesCounts.citations },
    { id: 'parts', title: 'Parts', count: connectionTypesCounts.parts },
    { id: 'partOf', title: 'Is Part Of', count: connectionTypesCounts.partOf },
    { id: 'versions', title: 'Versions', count: connectionTypesCounts.versions },
    { id: 'versionOf', title: 'Is Version Of', count: connectionTypesCounts.versionOf },
    { id: 'otherRelated', title: 'Other', count: connectionTypesCounts.otherRelated }
  ] : []

  const isConnectionTypeSet = searchParams?.has('connection-type')
  const hasAnyConnections = (counts: NonNullable<typeof connectionTypesCounts>) =>
    Object.values(counts).some(count => count > 0)
  const hasConnectionTypes = connectionTypesCounts ? hasAnyConnections(connectionTypesCounts) : false

  const defaultActiveKeys = [
    "authors-facets",
    "connection-type-facets",
    "published-facets",
    "work-type-facets",
    "license-facets",
    "language-facets",
    "field-of-science-facets",
    "registration-agency-facets",
    "conection-type-facets",
    "repository-type-facets"
  ]

  return (
    <>
      {!['doi.org/?', 'orcid.org/?', 'ror.org/?'].includes(url) && (
        <SearchBox path={path} />
      )}

      <FacetListGroup defaultActiveKey={defaultActiveKeys} >
      {hasConnectionTypes && (
        <FacetList
          data={connectionTypeList.filter(f => f.count > 0)}
          title="Connection Types"
          id="connection-type-facets"
          param="connection-type"
          url={url}
          checked={(i) => !isConnectionTypeSet && i == 0}
          radio
        />
      )}

      {model == "person"
        ? <AuthorsFacet authors={data.authors || []} title="Co-Authors" url={url} model={model} />
        : <AuthorsFacet authors={data.creatorsAndContributors || []} title="Creators & Contributors" url={url} model={model} />
      }


      <FacetList
        data={data.published}
        title="Publication Year"
        id="published-facets"
        param="published"
        url={url}
      />

      <FacetList
        data={data.resourceTypes?.filter(removeOtherAndMissing)}
        title="Work Type"
        id="work-type-facets"
        param="resource-type"
        url={url}
      />

      <FacetList
        data={data.licenses?.filter(removeOtherAndMissing)}
        title="License"
        id="license-facets"
        param="license"
        url={url}
      />

      <FacetList
        data={data.languages}
        title="Language"
        id="language-facets"
        param="language"
        url={url}
      />

      <FacetList
        data={data.fieldsOfScience}
        title="Field of Science"
        id="field-of-science-facets"
        param="field-of-science"
        url={url}
      />

      <FacetList
        data={data.registrationAgencies}
        title="Registration Agency"
        id="registration-agency-facets"
        param="registration-agency"
        url={url}
      />
      <FacetList
        data={data.clientTypes}
        title="Repository Type"
        id="repository-type-facets"
        param="repository-type"
        tooltipText='The type of DataCite Repository where a DOI is stored.'
        url={url}
      />
      </FacetListGroup>
    </>
  )
}
