import * as React from 'react'
import Error from '../Error/Error'
import { useQuery, gql } from '@apollo/client'
import Person from '../Person/Person'
import WorksListing from '../WorksListing/WorksListing'
import ContentLoader from 'react-content-loader'
import { orcidFromUrl } from '../../utils/helpers'
import Pluralize from 'react-pluralize'
import { useQueryState } from 'next-usequerystate'
import { Row, Col } from 'react-bootstrap'
import { WorkType } from '../WorkContainer/WorkContainer'
import {
  PageInfo,
  connectionFragment,
  contentFragment
} from '../SearchWork/SearchWork'

type Props = {
  orcid?: string
  searchQuery: string
}

export const DOI_GQL = gql`
  query getContentQuery(
    $id: ID!
    $query: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    person(id: $id) {
      id
      description
      links {
        url
        name
      }
      identifiers {
        identifier
        identifierType
      }
      country {
        name
        id
      }
      name
      alternateName
      givenName
      familyName
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
  }
  ${connectionFragment.workConnection}
  ${contentFragment.work}
`

export interface PersonType {
  id: string
  description: string
  links: Links[]
  identifiers: Identifiers[]
  country: Attribute
  name: string
  givenName: string
  familyName: string
  alternateName: string[]
  pageInfo: PageInfo
  works: Works
}

interface Links {
  name: string
  url: string
}

interface Identifiers {
  identifierType: string
  identifierUrl: string
  identifier: string
}

interface Country {
  id: string
  name: string
}

interface Works {
  totalCount: number
  resourceTypes: ContentFacet[]
  pageInfo: PageInfo
  published: ContentFacet[]
  licenses: ContentFacet[]
  languages: ContentFacet[]
  fieldsOfScience: ContentFacet[]
  registrationAgencies: ContentFacet[]
  nodes: WorkType[]
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

export interface Attribute {
  name: string
  id: string
}

export interface OrcidDataQuery {
  person: PersonType
}

interface OrcidQueryVar {
  id: string
  query: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  license: string
  fieldOfScience: string
  registrationAgency: string
}

const PersonContainer: React.FunctionComponent<Props> = ({ orcid, searchQuery }) => {
  const [cursor] = useQueryState('cursor', { history: 'push' })
  const [published] = useQueryState('published', {
    history: 'push'
  })
  const [resourceType] = useQueryState('resource-type', {
    history: 'push'
  })
  const [fieldOfScience] = useQueryState('field-of-science', {
    history: 'push'
  })
  const [language] = useQueryState('language', { history: 'push' })
  const [license] = useQueryState('license', { history: 'push' })
  const [registrationAgency] = useQueryState('registration-agency', {
    history: 'push'
  })
  // eslint-disable-next-line no-unused-vars

  const { loading, error, data } = useQuery<OrcidDataQuery, OrcidQueryVar>(
    DOI_GQL,
    {
      errorPolicy: 'all',
      variables: {
        id: 'http://orcid.org/' + orcid,
        query: searchQuery,
        cursor: cursor,
        published: published as string,
        resourceTypeId: resourceType as string,
        fieldOfScience: fieldOfScience as string,
        language: language as string,
        license: license as string,
        registrationAgency: registrationAgency as string
      }
    }
  )

  if (loading)
    return (
      <React.Fragment>
        <Col md={9} mdOffset={3}>
          <ContentLoader
            speed={1}
            width={1000}
            height={250}
            uniqueKey="2"
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
        </Col>
      </React.Fragment>
    )

  if (error)
    return (
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    )

  const orcidRecord = data.person

  const content = () => {
    return (
      <Col md={9} mdOffset={3}>
        <Person person={orcidRecord} />
      </Col>
    )
  }

  const relatedContent = () => {
    const hasNextPage = orcidRecord.works.pageInfo
      ? orcidRecord.works.pageInfo.hasNextPage
      : false
    const endCursor = orcidRecord.works.pageInfo
      ? orcidRecord.works.pageInfo.endCursor
      : ''

    const totalCount = orcidRecord.works.totalCount

    return (
      <React.Fragment>
        <Col md={9} mdOffset={3}>
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
        </Col>
        {/* TODO: I think the pager element within this should be more dynamic
        and not need to rely on passing in precalculated //
        hasNextPage/endCursor instead calculate based on data provided */}
        <WorksListing
          works={orcidRecord.works}
          loading={loading}
          showFacets={true}
          showAnalytics={true}
          hasPagination={orcidRecord.works.totalCount > 25}
          hasNextPage={hasNextPage}
          url={'/orcid.org' + orcidFromUrl(orcidRecord.id) + '/?'}
          endCursor={endCursor}
        />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Row>{content()}</Row>
      <Row>{relatedContent()}</Row>
    </React.Fragment>
  )
}

export default PersonContainer
