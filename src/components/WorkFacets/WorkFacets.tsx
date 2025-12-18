'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBox from '../SearchBox/SearchBox'
import AuthorsFacet from '../AuthorsFacet/AuthorsFacet'
import { Work, Facet } from 'src/data/types'
import FacetList from '../FacetList/FacetList'
import FacetListGroup from '../FacetList/FacetListGroup'
import { QueryVar, useSearchDoiQuery } from 'src/data/queries/searchDoiQuery'

interface Props {
  data: Facets
  model: string
  url: string
  vars?: QueryVar
}

interface Facets {
  published: Facet[]
  resourceTypes: Facet[]
  languages?: Facet[]
  licenses?: Facet[]
  repositories?: Facet[]
  affiliations?: Facet[]
  fieldsOfScience?: Facet[]
  registrationAgencies?: Facet[]
  authors?: Facet[]
  creatorsAndContributors?: Facet[]
  clients?: Facet[]
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
  vars
}: Props) {

  // get current query parameters from next router
  const searchParams = useSearchParams()

  // remove %2F? at the end of url
  const path = url.substring(0, url.length - 2)

  const allRelatedQuery = vars?.relatedToDoi ? useSearchDoiQuery({ relatedToDoi: vars.relatedToDoi, relatedDois: vars.relatedDois, connectionType: 'allRelated' }) : { loading: false, data: undefined, error: undefined }
  const referencesQuery = vars?.relatedToDoi ? useSearchDoiQuery({ relatedToDoi: vars.relatedToDoi, relatedDois: vars.relatedDois, connectionType: 'references' }) : { loading: false, data: undefined, error: undefined }
  const citationsQuery = vars?.relatedToDoi ? useSearchDoiQuery({ relatedToDoi: vars.relatedToDoi, relatedDois: vars.relatedDois, connectionType: 'citations' }) : { loading: false, data: undefined, error: undefined }
  const partsQuery = vars?.relatedToDoi ? useSearchDoiQuery({ relatedToDoi: vars.relatedToDoi, relatedDois: vars.relatedDois, connectionType: 'parts' }) : { loading: false, data: undefined, error: undefined }
  const partOfQuery = vars?.relatedToDoi ? useSearchDoiQuery({ relatedToDoi: vars.relatedToDoi, relatedDois: vars.relatedDois, connectionType: 'partOf' }) : { loading: false, data: undefined, error: undefined }
  const versionOfQuery = vars?.relatedToDoi ? useSearchDoiQuery({ relatedToDoi: vars.relatedToDoi, relatedDois: vars.relatedDois, connectionType: 'versionOf' }) : { loading: false, data: undefined, error: undefined }
  const versionsQuery = vars?.relatedToDoi ? useSearchDoiQuery({ relatedToDoi: vars.relatedToDoi, relatedDois: vars.relatedDois, connectionType: 'versions' }) : { loading: false, data: undefined, error: undefined }
  const otherRelatedQuery = vars?.relatedToDoi ? useSearchDoiQuery({ relatedToDoi: vars.relatedToDoi, relatedDois: vars.relatedDois, connectionType: 'otherRelated' }) : { loading: false, data: undefined, error: undefined }

  const connectionTypeList: Facet[] = [
    { id: 'allRelated', title: 'All', count: allRelatedQuery.data?.works?.totalCount ?? 0 },
    { id: 'references', title: 'References', count: referencesQuery.data?.works?.totalCount ?? 0 },
    { id: 'citations', title: 'Citations', count: citationsQuery.data?.works?.totalCount ?? 0 },
    { id: 'parts', title: 'Parts', count: partsQuery.data?.works?.totalCount ?? 0 },
    { id: 'partOf', title: 'Is Part Of', count: partOfQuery.data?.works?.totalCount ?? 0 },
    { id: 'versionOf', title: 'Version Of', count: versionOfQuery.data?.works?.totalCount ?? 0 },
    { id: 'versions', title: 'Versions', count: versionsQuery.data?.works?.totalCount ?? 0 },
    { id: 'otherRelated', title: 'Other', count: otherRelatedQuery.data?.works?.totalCount ?? 0 }
  ]

  const organizationRelationTypeList: Facet[] = [
    { id: "allRelated", title: "All", count: 0 },
    { id: "createdOrContributedByAffiliatedResearcher", title: "By Affiliated Researchers", tooltipText: "Works created or contributed by researchers affiliated with the organization.", count: 0 },
    { id: "createdContributedOrPublishedBy", title: "Created By", tooltipText: "Works created, contributed, or published by the organization.", count: 0 },
    { id: "fundedBy", title: "Funded By", tooltipText: "Works funded by the organization and its child organizations.", count: 0 },
    // OMP relationships are included in allRelated, but we don't document or explain this functionality ATM.
    // { id: "connectedToOrganizationOMPs", title: "Related to OMPs", tooltipText: "Works related to Output Management Plans associated with the organization.", count: 0 },
  ]

  const isConnectionTypeSet = searchParams?.has('connection-type')
  const isOrganizationRelationTypeSet = searchParams?.has('organization-relation-type')

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
    "repository-type-facets",
    "organization-relation-type-facets",
    "repository-facets"
  ]

  return (
    <>
      {!['doi.org/?', 'orcid.org/?', 'ror.org/?'].includes(url) && (
        <SearchBox path={path} />
      )}

      <FacetListGroup defaultActiveKey={defaultActiveKeys} >
      {url.startsWith('/doi.org/') && (
        <FacetList
          data={connectionTypeList}
          title="Connection Types"
          id="connection-type-facets"
          param="connection-type"
          url={url}
          checked={(i) => !isConnectionTypeSet && i == 0}
          radio
        />
      )}

      {url.startsWith('/ror.org') && (
        <FacetList
          data={organizationRelationTypeList}
          title="Organization Relation Types"
          id="organization-relation-type-facets"
          param="organization-relation-type"
          url={url}
          checked={(i) => !isOrganizationRelationTypeSet && i == 0}
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

      {!url.startsWith('/repositories') && (
        <>
          <FacetList
              data={data.clients}
              title="Repository"
              id="repository-facets"
              param="client-id"
              tooltipText='The DataCite Repository where a DOI is stored.'
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
        </>
      )}
      </FacetListGroup>
    </>
  )
}
