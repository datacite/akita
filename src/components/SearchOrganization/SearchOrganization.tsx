import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Row, Alert } from 'react-bootstrap'
import { useQueryState } from 'next-usequerystate'
import ContentLoader from 'react-content-loader'
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

interface OrganizationsEdge {
  node: OrganizationsNode
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
    edges: OrganizationsEdge[]
    types: OrganizationFacet[]
    countries: OrganizationFacet[]
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
      edges {
        node {
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
    }
  }
`

const SearchOrganizations: React.FunctionComponent<Props> = ({
  searchQuery
}) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [types] = useQueryState<string>('types')
  const [country] = useQueryState<string>('country')
  const [searchResults, setSearchResults] = React.useState<
    OrganizationMetadataRecord[]
  >([])

  const { loading, error, data, refetch } = useQuery<
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

  React.useEffect(() => {
    refetch({ query: searchQuery, cursor: cursor })

    const results: OrganizationMetadataRecord[] = []

    if (data) {
      data.organizations.edges.map((edge) => {
        let grid = edge.node.identifiers.filter(i => {
          return i.identifierType === 'grid'
        })
        let fundref = edge.node.identifiers.filter(i => {
          return i.identifierType === 'fundref'
        })
        let isni = edge.node.identifiers.filter(i => {
          return i.identifierType === 'isni'
        })
        let wikidata = edge.node.identifiers.filter(i => {
          return i.identifierType === 'wikidata'
        })

        let orgMetadata: OrganizationMetadataRecord = {
          id: edge.node.id,
          name: edge.node.name,
          alternateNames: edge.node.alternateName,
          types: edge.node.types,
          url: edge.node.url,
          wikipediaUrl: edge.node.wikipediaUrl,
          countryName: edge.node.address.country,
          grid: grid,
          fundref: fundref,
          isni: isni,
          wikidata: wikidata,
          identifiers: edge.node.identifiers
        }

        results.push(orgMetadata)

        return results
      })

      setSearchResults(results)
    }
  }, [searchQuery, data, refetch])

  const renderResults = () => {
    if (loading)
      return (
        <div className="row">
          <div className="col-md-3"></div>
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
        </div>
      )

    if (!loading && searchResults.length == 0)
      return (
        <React.Fragment>
          <Alert bsStyle="warning">No content found.</Alert>
        </React.Fragment>
      )

    if (error)
      return (
        <Error
          title="Something went wrong."
          message="Unable to load services."
        />
      )

    if (!data) return ''

    const hasNextPage = data.organizations.pageInfo
      ? data.organizations.pageInfo.hasNextPage
      : false
    const endCursor = data.organizations.pageInfo
      ? data.organizations.pageInfo.endCursor
      : ''

    return (
      <div className="col-md-9 panel-list" id="content">
        <div className="panel panel-transparent content-item">
          <div className="panel-body">
            {searchResults.length > 1 && (
              <h3 className="member-results">
                {data.organizations.totalCount.toLocaleString('en-US')} Results
              </h3>
            )}

            {searchResults.map((item) => (
              <React.Fragment key={item.id}>
                <OrganizationMetadata
                  metadata={item}
                  linkToExternal={false}
                ></OrganizationMetadata>
              </React.Fragment>
            ))}

            <Pager
              url={'/?'}
              hasNextPage={hasNextPage}
              endCursor={endCursor}
            ></Pager>
          </div>
        </div>
      </div>
    )
  }

  const renderFacets = () => {
    if (!data) return ''

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
              {data.organizations.countries.map((facet) => (
                <li key={facet.id}>
                  <FilterItem
                    name="country"
                    id={facet.id}
                    count={facet.count}
                    title={facet.title}
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
              {data.organizations.types.map((facet) => (
                <li key={facet.id}>
                  <FilterItem
                    name="types"
                    id={facet.id}
                    count={facet.count}
                    title={facet.title}
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
