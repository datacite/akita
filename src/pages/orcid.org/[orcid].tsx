import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import truncate from 'lodash/truncate'
import { Row, Col } from 'react-bootstrap'
import { useQueryState } from 'nuqs'

import Layout from '../../components/Layout/Layout'
import Error from '../../components/Error/Error'
import Person from '../../components/Person/Person'
import { Work } from 'src/data/types'
import WorksListing from '../../components/WorksListing/WorksListing'
import Loading from '../../components/Loading/Loading'
import { orcidFromUrl, pluralize } from '../../utils/helpers'
import {
  MultilevelFacet,
  PageInfo,
  connectionFragment,
  contentFragment
} from '../../components/SearchWork/SearchWork'
import ShareLinks from '../../components/ShareLinks/ShareLinks'

type Props = {
  orcid?: string
  isBot?: boolean
}

const PERSON_GQL = gql`
  query getPersonQuery(
    $id: ID!
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
        identifierUrl
      }
      country {
        name
        id
      }
      name
      alternateName
      givenName
      familyName
      employment {
        organizationId
        organizationName
        roleTitle
        startDate
        endDate
      }
      citationCount
      viewCount
      downloadCount
      totalWorks: works {
        totalCount
        totalContentUrl
        totalOpenLicenses
        openLicenseResourceTypes {
          id
          title
          count
        }
      }
    }
  }
`

export const RELATED_CONTENT_GQL = gql`
  query getRelatedContentQuery(
    $id: ID!
    $filterQuery: String
    $cursor: String
    $published: String
    $resourceTypeId: String
    $fieldOfScience: String
    $language: String
    $license: String
    $registrationAgency: String
  ) {
    person(id: $id) {
      works(
        first: 25
        query: $filterQuery
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
  citationCount: number
  viewCount: number
  downloadCount: number
  employment: Organization[]
  pageInfo: PageInfo
  totalWorks: Works
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

interface Organization {
  organizationId: string
  organizationName: string
  roleTitle: string
  startDate: Date
  endDate: Date
}

interface Works {
  totalCount: number
  totalContentUrl: number
  totalOpenLicenses: number
  openLicenseResourceTypes: ContentFacet[]
  resourceTypes: ContentFacet[]
  pageInfo: PageInfo
  published: ContentFacet[]
  licenses: ContentFacet[]
  languages: ContentFacet[]
  fieldsOfScience: ContentFacet[]
  registrationAgencies: ContentFacet[]
  nodes: Work[]
  personToWorkTypesMultilevel: MultilevelFacet[]
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
  filterQuery: string
  cursor: string
  published: string
  resourceTypeId: string
  language: string
  license: string
  fieldOfScience: string
  registrationAgency: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const orcid = context.params?.orcid as String

  return {
    props: {
      orcid,
      isBot: JSON.parse(context.query.isBot as string)
    }
  }
}

const PersonPage: React.FunctionComponent<Props> = ({ orcid, isBot = false }) => {
  const [filterQuery] = useQueryState('filterQuery')
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

  const variables = {
    id: 'http://orcid.org/' + orcid,
    filterQuery: filterQuery as string,
    cursor: cursor as string,
    published: published as string,
    resourceTypeId: resourceType as string,
    fieldOfScience: fieldOfScience as string,
    language: language as string,
    license: license as string,
    registrationAgency: registrationAgency as string
  }

  const personQuery = useQuery<OrcidDataQuery, OrcidQueryVar>(PERSON_GQL, { errorPolicy: 'all', variables: variables })
  const relatedContentQuery = useQuery<OrcidDataQuery, OrcidQueryVar>(RELATED_CONTENT_GQL, {
      errorPolicy: 'all',
      variables: variables,
      skip: isBot
    }
  )

  if (personQuery.loading)
    return (
      <Layout path={'/orcid.org/' + orcid}>
        <Loading />
      </Layout>
    )

  if (personQuery.error)
    return (
      <Layout path={'/orcid.org/' + orcid}>
        <Col md={9} mdOffset={3}>
          <Error title="An error occured." message={personQuery.error.message} />
        </Col>
      </Layout>
    )

  const person = personQuery.data?.person || {} as PersonType

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/orcid.org/' + person.id
      : 'https://commons.stage.datacite.org/orcid.org/' + person.id

  const imageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/images/logo.png'
      : 'https://commons.stage.datacite.org/images/logo.png'

  const title = person.name
    ? 'DataCite Commons: ' + person.name
    : 'DataCite Commons: ' + person.id

  const description = !person.description
    ? null
    : truncate(person.description, {
        length: 2500,
        separator: '… '
      })

  const content = () => {
    return (
      <>
        <Col md={3} id="side-bar">
          <ShareLinks url={'orcid.org' + orcidFromUrl(person.id)} title={person.name} />
        </Col>
        <Col md={9}>
          <Person person={person} />
        </Col>
      </>
    )
  }

  const relatedContent = () => {
    if (relatedContentQuery.loading) return <Loading />

    if (relatedContentQuery.error)
      return <Row>
        <Col mdOffset={3} className="panel panel-transparent">
          <Error title="An error occured loading related content." message={relatedContentQuery.error.message} />
        </Col>
      </Row>

    if (!relatedContentQuery.data) return

    const relatedWorks = relatedContentQuery.data.person.works

    const hasNextPage = relatedWorks.pageInfo
      ? relatedWorks.pageInfo.hasNextPage
      : false
    const endCursor = relatedWorks.pageInfo
      ? relatedWorks.pageInfo.endCursor
      : ''

    const totalCount = relatedWorks.totalCount

    return (
      <>
        <Col md={9} mdOffset={3}>
          <h3 className="member-results">{pluralize(totalCount, 'Work')}</h3>
        </Col>
        <WorksListing
          works={relatedWorks}
          loading={relatedContentQuery.loading}
          showFacets={true}
          showAnalytics={true}
          showClaimStatus={true}
          hasPagination={relatedWorks.totalCount > 25}
          hasNextPage={hasNextPage}
          model={'person'}
          url={'/orcid.org/' + orcid + '/?'}
          endCursor={endCursor}
        />
      </>
    )
  }

  return (
    <Layout path={'/orcid.org'}>
      <Head>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta name="og:description" content={description} />
          </>
        )}
        <meta name="og:url" content={pageUrl} />
        <meta name="og:image" content={imageUrl} />
        <meta name="og:type" content="person" />
      </Head>
      <Row>
        <Col md={9} mdOffset={3}>
          <h3 className="member-results">{person.id}</h3>
        </Col>
      </Row>
      <Row>{content()}</Row>
      <Row>{relatedContent()}</Row>
    </Layout>
  )
}

export default PersonPage
