import * as React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useQueryState } from 'next-usequerystate'
import { Alert, Row } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
import WorksListing from '../WorksListing/WorksListing'
import { WorkType } from '../WorkContainer/WorkContainer'
import Error from '../Error/Error'
import ContentLoader from 'react-content-loader'

type Props = {
  searchQuery: string
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

export interface Works {
  totalCount: number
  pageInfo: PageInfo
  published: ContentFacet[]
  resourceTypes: ContentFacet[]
  languages: ContentFacet[]
  licenses: ContentFacet[]
  fieldsOfScience: ContentFacet[]
  registrationAgencies: ContentFacet[]
  nodes: WorkType[]
}

interface ContentQueryData {
  works: Works
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

export const connectionFragment = {
  workConnection: gql`
    fragment WorkConnectionFragment on WorkConnectionWithTotal {
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
    }
  `
}

export const contentFragment = {
  work: gql`
    fragment WorkFragment on Work {
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
  `
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
      ...WorkConnectionFragment
      nodes {
        ...WorkFragment
      }
    }
  }
  ${connectionFragment.workConnection}
  ${contentFragment.work}
`

const SearchWork: React.FunctionComponent<Props> = ({ searchQuery }) => {
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

    let results: WorkType[] = []

    if (searchQuery) {
      if (data) results = data.works.nodes
    }
    setSearchResults(results)

    return () => clearTimeout(typingDelay)
  }, [searchQuery, data, refetch])

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

    if (!data) return null

    if (!loading && searchResults.length == 0)
      return (
        <div className="col-md-9">
          <div className="alert-works">
            <Alert bsStyle="warning">No works found.</Alert>
          </div>
        </div>
      )

    const hasNextPage = data.works.pageInfo
      ? data.works.pageInfo.hasNextPage
      : false
    const endCursor = data.works.pageInfo ? data.works.pageInfo.endCursor : ''

    const totalCount = data.works.totalCount

    return (
      <div>
        <div className="col-md-9 col-md-offset-3" id="content">
          {totalCount > 0 && (
            <h3 className="member-results">
              {totalCount.toLocaleString('en-US') + ' '}
              <Pluralize
                singular={'Work'}
                count={totalCount}
                showCount={false}
              />
            </h3>
          )}
        </div>

        <WorksListing
          works={data.works}
          loading={loading}
          showFacets={true}
          showAnalytics={false}
          url={'/?'}
          hasPagination={data.works.totalCount > 25}
          hasNextPage={hasNextPage}
          endCursor={endCursor}
        />
      </div>
    )
  }

  return (
    <React.Fragment>
      <Row>{renderResults()}</Row>
    </React.Fragment>
  )
}

export default SearchWork
