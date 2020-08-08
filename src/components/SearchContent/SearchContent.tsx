import * as React from 'react'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import { useQueryState } from 'next-usequerystate'
import { Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import Error from '../Error/Error'
import ContentLoader from 'react-content-loader'
import Pager from '../Pager/Pager'

type Props = {
  searchQuery: string
}

interface ContentNode {
  node: DoiType
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

export interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface ContentQueryData {
  works: {
    __typename: String
    nodes: ContentNode[]
    pageInfo: PageInfo
    published: ContentFacet[]
    resourceTypes: ContentFacet[]
    languages: ContentFacet[]
    fieldsOfScience: ContentFacet[]
    licenses: ContentFacet[]
    registrationAgencies: ContentFacet[]
    totalCount: Number
  }
}

interface ContentQueryVar {
  query: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  fieldOfScience: string
  license: string
  registrationAgency: string
}

export const CONTENT_GQL = gql`
  query getContentQuery(
    $query: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    works(
      first: 25
      query: $query
      after: $cursor
      published: $published
      resourceTypeId: $resourceTypeId
      fieldOfScience: $fieldOfScience
      language: $language
      license: $license
      registrationAgency: $registrationAgency
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      resourceTypes {
        id
        title
        count
      }
      published {
        id
        title
        count
      }
      languages {
        id
        title
        count
      }
      fieldsOfScience {
        id
        title
        count
      }
      licenses {
        id
        title
        count
      }
      registrationAgencies {
        id
        title
        count
      }
      nodes {
        id
        doi
        types {
          resourceTypeGeneral
          resourceType
        }
        titles {
          title
        }
        creators {
          id
          name
          givenName
          familyName
        }
        descriptions {
          description
          descriptionType
        }
        publicationYear
        publisher
        version
        rights {
          rights
          rightsUri
          rightsIdentifier
        }
        fieldsOfScience {
          id
          name
        }
        language {
          id
          name
        }
        registrationAgency {
          id
          name
        }
        registered
        citationCount
        viewCount
        downloadCount
      }
    }
  }
`

const Search: React.FunctionComponent<Props> = ({ searchQuery }) => {
  const router = useRouter()

  /* eslint-disable no-unused-vars */
  const [published] = useQueryState('published', {
    history: 'push'
  })
  const [resourceType] = useQueryState('resource-type', {
    history: 'push'
  })
  const [fieldOfScience] = useQueryState('field-of-science', {
    history: 'push'
  })
  const [license] = useQueryState('license', { history: 'push' })
  const [language] = useQueryState('language', { history: 'push' })
  const [registrationAgency] = useQueryState('registration-agency', {
    history: 'push'
  })
  const [cursor] = useQueryState('cursor', { history: 'push' })
  /* eslint-enable no-unused-vars */
  const [searchResults, setSearchResults] = React.useState([])
  const { loading, error, data, refetch } = useQuery<
    ContentQueryData,
    ContentQueryVar
  >(CONTENT_GQL, {
    errorPolicy: 'all',
    variables: {
      query: searchQuery,
      cursor: cursor,
      published: published as string,
      resourceTypeId: resourceType as string,
      fieldOfScience: fieldOfScience as string,
      language: language as string,
      license: license as string,
      registrationAgency: registrationAgency as string
    }
  })

  // const renderPagination = () => {
  //   let url = '/?'
  //   let firstPageUrl = null
  //   let hasFirstPage = false
  //   let nextPageUrl = null
  //   let hasNextPage = false

  //   // get current query parameters from next router
  //   let params = new URLSearchParams(router.query as any)

  //   if (params.get('cursor')) {
  //     // remove cursor query parameter for first page
  //     params.delete('cursor')
  //     firstPageUrl = url + params.toString()
  //     hasFirstPage = typeof firstPageUrl === 'string'
  //   }

  //   if (data.works.pageInfo.hasNextPage && data.works.pageInfo.endCursor) {
  //     // set cursor query parameter for next page
  //     params.set('cursor', data.works.pageInfo.endCursor)
  //     nextPageUrl = url + params.toString()
  //     hasNextPage = typeof nextPageUrl === 'string'
  //   }

  //   return (
  //     <Pager>
  //       <Pager.Item disabled={!hasFirstPage} href={firstPageUrl}>
  //         First Page
  //       </Pager.Item>
  //       <Pager.Item disabled={!hasNextPage} href={nextPageUrl}>
  //         Next Page
  //       </Pager.Item>
  //     </Pager>
  //   )
  // }

  React.useEffect(() => {
    const typingDelay = setTimeout(() => {
      refetch({
        query: searchQuery,
        cursor: cursor,
        published: published as string,
        resourceTypeId: resourceType as string,
        fieldOfScience: fieldOfScience as string,
        language: language as string,
        license: license as string,
        registrationAgency: registrationAgency as string
      })
    }, 1000)

    let results: ContentNode[] = []

    if (searchQuery) {
      if (data) results = data.works.nodes
    }
    setSearchResults(results)

    return () => clearTimeout(typingDelay)
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

    if (error)
      return <Error title="An error occured." message={error.message} />

    if (!loading && searchResults.length == 0)
      return (
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-9">
            <Alert bsStyle="warning">No content found.</Alert>
          </div>
        </div>
      )

    const hasNextPage = data.works.pageInfo
      ? data.works.pageInfo.hasNextPage
      : false
    const endCursor = data.works.pageInfo
      ? data.works.pageInfo.endCursor
      : ''

    return (
      <div className="col-md-9" id="content">
        {searchResults.length > 1 && (
          <h3 className="member-results">
            {data.works.totalCount.toLocaleString('en-US')} Content Items
          </h3>
        )}

        {searchResults.map((item) => (
          <React.Fragment key={item.id}>
            <DoiMetadata metadata={item} />
          </React.Fragment>
        ))}

        {searchResults.length > 25 && (
          <Pager
            url={'/?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
          ></Pager>
        )}
      </div>
    )
  }

  const renderFacets = () => {
    if (loading) return <div className="col-md-3"></div>

    if (!loading && searchResults.length == 0)
      return <div className="col-md-3"></div>

    function facetLink(param: string, value: string) {
      let url = '/?'
      let icon = faSquare

      // get current query parameters from next router
      let params = new URLSearchParams(router.query as any)

      // delete cursor parameter
      params.delete('cursor')

      if (params.get(param) == value) {
        // if param is present, delete from query and use checked icon
        params.delete(param)
        icon = faCheckSquare
      } else {
        // otherwise replace param with new value and use unchecked icon
        params.set(param, value)
      }

      url += params.toString()
      return (
        <Link href={url}>
          <a>
            <FontAwesomeIcon icon={icon} />{' '}
          </a>
        </Link>
      )
    }

    return (
      <div className="col-md-3 hidden-xs hidden-sm">
        <div className="panel panel-transparent">
          <div className="panel-body">
            <div className="edit"></div>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Publication Year</h4>
            <ul>
              {data.works.published.map((facet) => (
                <li key={facet.id}>
                  {facetLink('published', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel facets add">
          <div className="panel-body">
            <h4>Content Type</h4>
            <ul>
              {data.works.resourceTypes.map((facet) => (
                <li key={facet.id}>
                  {facetLink('resource-type', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {data.works.fieldsOfScience.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Field of Science</h4>
              <ul>
                {data.works.fieldsOfScience.map((facet) => (
                  <li key={facet.id}>
                    {facetLink('field-of-science', facet.id)}
                    <div className="facet-title">{facet.title}</div>
                    <span className="number pull-right">
                      {facet.count.toLocaleString('en-US')}
                    </span>
                    <div className="clearfix" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {data.works.licenses.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>License</h4>
              <ul>
                {data.works.licenses.map((facet) => (
                  <li key={facet.id}>
                    {facetLink('license', facet.id)}
                    <div className="facet-title">{facet.title}</div>
                    <span className="number pull-right">
                      {facet.count.toLocaleString('en-US')}
                    </span>
                    <div className="clearfix" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {data.works.languages.length > 0 && (
          <div className="panel facets add">
            <div className="panel-body">
              <h4>Language</h4>
              <ul>
                {data.works.languages.map((facet) => (
                  <li key={facet.id}>
                    {facetLink('language', facet.id)}
                    <div className="facet-title">{facet.title}</div>
                    <span className="number pull-right">
                      {facet.count.toLocaleString('en-US')}
                    </span>
                    <div className="clearfix" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="panel facets add">
          <div className="panel-body">
            <h4>DOI Registration Agency</h4>
            <ul>
              {data.works.registrationAgencies.map((facet) => (
                <li key={facet.id}>
                  {facetLink('registration-agency', facet.id)}
                  <div className="facet-title">{facet.title}</div>
                  <span className="number pull-right">
                    {facet.count.toLocaleString('en-US')}
                  </span>
                  <div className="clearfix" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      {renderFacets()}
      {renderResults()}
    </div>
  )
}

export default Search
