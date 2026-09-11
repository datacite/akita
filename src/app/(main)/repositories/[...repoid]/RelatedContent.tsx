'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Loading from 'src/components/Loading/Loading'

import { useRepositoryRelatedContentQuery } from 'src/data/queries/repositoryRelatedContentQuery'

import Error from 'src/components/Error/Error'
import WorksListing, { SortBy } from 'src/components/WorksListing/WorksListing'
import { pluralize } from 'src/utils/helpers'
import { useSearchParams } from 'next/navigation'
import mapSearchparams from './mapSearchParams'
import { Repository } from 'src/data/types'
import SearchBox from 'src/components/SearchBox/SearchBox'
import CommonsLayout from 'src/components/CommonsLayout/CommonsLayout'

interface Props {
  repository: Repository
}

export default function RelatedContent({ repository }: Props) {
  const clientId = repository.clientId

  const searchParams = useSearchParams()
  const { variables } = mapSearchparams(
    Object.fromEntries(searchParams.entries()) as any
  )

  const vars = { clientId, ...variables }
  const { loading, data, error, facetsLoading } =
    useRepositoryRelatedContentQuery(vars)

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

  const relatedWorks = data.works

  const hasNextPage = relatedWorks.totalCount > 25
  const endCursor = relatedWorks.pageInfo ? relatedWorks.pageInfo.endCursor : ''

  const totalCount = relatedWorks.totalCount
  const url = '/repositories/' + clientId + '/'

  return (
    <>
      <CommonsLayout className="mt-5">
        <Row className="border-bottom ms-1 mb-3">
          <Col className="ps-0">
            <h2 className="visually-hidden">Related Works Results Summary</h2>
            <h3 className="member-results border-0 mb-0">
              {pluralize(totalCount, 'Work')}
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
        loadingFacets={facetsLoading}
        showAnalytics={true}
        showClaimStatus={true}
        hasPagination={relatedWorks.totalCount > 25}
        hasNextPage={hasNextPage}
        model={'repository'}
        url={url + '?'}
        endCursor={endCursor}
        show={{ all: true }}
        searchBox={
          <SearchBox path={url} placeholder="Search within these works..." />
        }
      />
    </>
  )
}
