import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Alert } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'
import ContentLoader from 'react-content-loader'
import Pluralize from 'react-pluralize'

import Pager from '../Pager/Pager'
import FilterItem from '../FilterItem/FilterItem'
import Error from '../Error/Error'
import {
  OrganizationMetadata,
  OrganizationMetadataRecord
} from '../OrganizationMetadata/OrganizationMetadata'

type Props = {
  searchQuery: string
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface OrganizationsNode {
  id: string
  name: string
  alternateName: string[]
  types: string[]
  url: string
  wikipediaUrl: string
  address: {
    country: string
  }
  grid: [
    {
      identifier: string
      identifierType: string
    }
  ]
  fundref: [
    {
      identifier: string
      identifierType: string
    }
  ]
  isni: [
    {
      identifier: string
      identifierType: string
    }
  ]
  wikidata: [
    {
      identifier: string
      identifierType: string
    }
  ]
  identifiers: [
    {
      identifier: string
      identifierType: string
    }
  ]
}

interface OrganizationFacet {
  id: string
  title: string
  count: number
}

interface OrganizationsQueryVar {
  query: string
  cursor: string
  types: string
  country: string
}

interface OrganizationsQueryData {
  organizations: {
    totalCount: number
    pageInfo: PageInfo
    types: OrganizationFacet[]
    countries: OrganizationFacet[]
    nodes: OrganizationsNode[]
  }
}

export const ORGANIZATIONS_GQL = gql`
  query getOrganizationQuery(
    $query: String
    $cursor: String
    $types: String
    $country: String
  ) {
    organizations(
      query: $query
      after: $cursor
      types: $types
      country: $country
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      types {
        id
        count
        title
      }
      countries {
        id
        count
        title
      }
      nodes {
        id
        name
        alternateName
        types
        url
        wikipediaUrl
        address {
          country
        }
        identifiers {
          identifier
          identifierType
        }
      }
    }
  }
`

const SearchOrganizations: React.FunctionComponent<Props> = ({
  searchQuery
}) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [types] = useQueryState<string>('types')
  const [country] = useQueryState<string>('country')

  const { loading, error, data } = useQuery<
    OrganizationsQueryData,
    OrganizationsQueryVar
  >(ORGANIZATIONS_GQL, {
    errorPolicy: 'all',
    variables: {
      query: searchQuery,
      cursor: cursor,
      types: types,
      country: country
    }
  })

  const renderResults = () => {
    if (loading)
      return (
        <div className="col-md-9">
          <ContentLoader
            speed={1}
            width={1000}
            height={250}
            viewBox="0 0 1000 250"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="117" y="34" rx="3" ry="3" width="198" height="14" />
            <rect x="117" y="75" rx="3" ry="3" width="117" height="14" />
            <rect x="9" y="142" rx="3" ry="3" width="923" height="14" />
            <rect x="9" y="178" rx="3" ry="3" width="855" height="14" />
            <rect x="9" y="214" rx="3" ry="3" width="401" height="14" />
            <circle cx="54" cy="61" r="45" />
          </ContentLoader>
        </div>
      )

    if (error)
      return (
        <div className="col-md-9">
          <Error title="An error occured." message={error.message} />
        </div>
      )

    const results: OrganizationMetadataRecord[] = []

    if (data) {
      data.organizations.nodes.map((node) => {
        let grid = node.identifiers.filter((i) => {
          return i.identifierType === 'grid'
        })
        let fundref = node.identifiers.filter((i) => {
          return i.identifierType === 'fundref'
        })
        let isni = node.identifiers.filter((i) => {
          return i.identifierType === 'isni'
        })
        let wikidata = node.identifiers.filter((i) => {
          return i.identifierType === 'wikidata'
        })

        let orgMetadata: OrganizationMetadataRecord = {
          id: node.id,
          name: node.name,
          alternateNames: node.alternateName,
          types: node.types,
          url: node.url,
          wikipediaUrl: node.wikipediaUrl,
          countryName: node.address.country,
          grid: grid,
          fundref: fundref,
          isni: isni,
          wikidata: wikidata,
          identifiers: node.identifiers
        }

        results.push(orgMetadata)

        return results
      })
    }

    if (results.length == 0)
      return (
        <div className="col-md-9">
          <Alert bsStyle="warning">No organizations found.</Alert>
        </div>
      )

    const hasNextPage = data.organizations.pageInfo
      ? data.organizations.pageInfo.hasNextPage
      : false
    const endCursor = data.organizations.pageInfo
      ? data.organizations.pageInfo.endCursor
      : ''

    return (
      <div className="col-md-9" id="content">
        {results.length > 0 && (
          <h3 className="member-results">
            {data.organizations.totalCount.toLocaleString('en-US') + ' '}
            <Pluralize
              singular={'Organization'}
              count={data.organizations.totalCount}
              showCount={false}
            />
          </h3>
        )}

        {results.map((item) => (
          <React.Fragment key={item.id}>
            <OrganizationMetadata
              metadata={item}
              linkToExternal={false}
            ></OrganizationMetadata>
          </React.Fragment>
        ))}

        {data.organizations.totalCount > 20 && (
          <Pager
            url={'/ror.org?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        )}
      </div>
    )
  }

  const renderFacets = () => {
    if (loading) return <div className="col-md-3"></div>

    if (!data) return null

    if (!loading && data && data.organizations.totalCount == 0)
      return <div className="col-md-3"></div>

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit"></div>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Country</h4>
            <ul>
              {data &&
                data.organizations.countries.map((facet) => (
                  <li key={facet.id}>
                    <FilterItem
                      name="country"
                      id={facet.id}
                      title={facet.title}
                      count={facet.count}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Organization Type</h4>
            <ul>
              {data &&
                data.organizations.types.map((facet) => (
                  <li key={facet.id}>
                    <FilterItem
                      name="types"
                      id={facet.id}
                      title={facet.title}
                      count={facet.count}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Row>
      {renderFacets()}
      {renderResults()}
    </Row>
  )
}

export default SearchOrganizations
