'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Loading from 'src/components/Loading/Loading'

import { usePersonRelatedContentQuery } from 'src/data/queries/personRelatedContentQuery'

import Error from 'src/components/Error/Error'
import WorksListing, { SortBy } from 'src/components/WorksListing/WorksListing'
import SearchBox from 'src/components/SearchBox/SearchBox'
import { pluralize } from 'src/utils/helpers'
import { useParams, useSearchParams } from 'next/navigation'
import mapSearchparams from './mapSearchParams'
import CommonsLayout from 'src/components/CommonsLayout/CommonsLayout'

interface Props {
  isBot?: boolean
}

export default function RelatedContent(props: Props) {
  const { isBot = false } = props
  const orcid = useParams().orcid as string

  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(
    Object.fromEntries(searchParams.entries()) as any
  )

  const vars = { userId: orcid, ...variables }

  const { loading, data, error } = usePersonRelatedContentQuery(vars)

  if (isBot) return null

  if (loading)
    return (
      <Row>
        <Loading />
      </Row>
    )

  if (error)
    return (
      <CommonsLayout mainClassName="panel panel-transparent">
        <Error
          title="An error occured loading related content."
          message={error.message}
        />
      </CommonsLayout>
    )

  if (!data) return

  const relatedWorks = data.person.works

  const hasNextPage = relatedWorks.pageInfo
    ? relatedWorks.pageInfo.hasNextPage
    : false
  const endCursor = relatedWorks.pageInfo ? relatedWorks.pageInfo.endCursor : ''
  const url = '/orcid.org/' + orcid + '/'

  return (
    <>
      <CommonsLayout className="mt-5">
        <Row className="border-bottom ms-1 mb-3">
          <Col className="ps-0">
            <h3 className="member-results border-0 mb-0">
              {pluralize(relatedWorks.totalCount, 'Work')}
            </h3>
          </Col>
          <Col xs="auto">
            <SortBy />
          </Col>
        </Row>
      </CommonsLayout>
      <WorksListing
        works={relatedWorks}
        loading={loading}
        showAnalytics={true}
        showClaimStatus={true}
        hasPagination={relatedWorks.totalCount > 25}
        hasNextPage={hasNextPage}
        model={'person'}
        url={url + '?'}
        endCursor={endCursor}
        searchBox={
          <SearchBox path={url} placeholder="Search within these works..." />
        }
      />
    </>
  )
}
