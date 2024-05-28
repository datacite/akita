'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import { Col, Row } from "src/components/Layout";
import Loading from 'src/components/Loading/Loading'

import { RELATED_CONTENT_QUERY, QueryVar, QueryData } from 'src/data/queries/personQuery'

import Error from 'src/components/Error/Error'
import WorksListing from 'src/components/WorksListing/WorksListing'
import { pluralize } from 'src/utils/helpers';

interface Props {
  orcid: string
  variables: QueryVar
  isBot?: boolean
}

export default function RelatedContent(props: Props) {
  const { orcid, variables, isBot = false } = props

  const { loading, data, error } = useQuery<QueryData, QueryVar>(
    RELATED_CONTENT_QUERY,
    {
      variables: variables,
      errorPolicy: 'all',
      skip: isBot
    }
  )

  if (isBot) return null

  if (loading) return <Row><Loading /></Row>

  if (error)
    return <Row>
      <Col mdOffset={3} className="panel panel-transparent">
        <Error title="An error occured loading related content." message={error.message} />
      </Col>
    </Row>

  if (!data) return

  const relatedWorks = data.person.works

  const hasNextPage = relatedWorks.pageInfo
    ? relatedWorks.pageInfo.hasNextPage
    : false
  const endCursor = relatedWorks.pageInfo
    ? relatedWorks.pageInfo.endCursor
    : ''

  return (
    <>
      <Row>
        <Col mdOffset={3} className="panel panel-transparent">
          <div className="panel-body">
            <h3 className="member-results" id="title">{pluralize(relatedWorks.totalCount, 'Work')}</h3>
          </div>
        </Col>
      </Row>
      <Row>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <WorksListing
              works={relatedWorks}
              loading={loading}
              showFacets={true}
              showAnalytics={true}
              showClaimStatus={true}
              hasPagination={relatedWorks.totalCount > 25}
              hasNextPage={hasNextPage}
              model={'person'}
              url={'/orcid.org/' + orcid + '/?'}
              endCursor={endCursor}
            />
          </div>
        </div>
      </Row>
    </>
  )
}
