'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import WorkFacets from 'src/components/WorkFacets/WorkFacets'
import WorkMetadata from 'src/components/WorkMetadata/WorkMetadata'
import { ConnectionTypeCounts, OrganizationRelationTypeCounts, Works } from 'src/data/types'
import Loading from 'src/components/Loading/Loading'
import LoadingFacetList from 'src/components/Loading/LoadingFacetList'
import NoResults from 'src/components/NoResults/NoResults'

import Pager from 'src/components/Pager/Pager'
import type { ShowCharts } from 'src/components/WorksDashboard/WorksDashboard'
import { multilevelToSankey } from 'src/components/SankeyGraph/sankeyUtils'
import Dropdown from 'react-bootstrap/Dropdown'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useSearchParams } from 'next/navigation'
import type { SortOption } from 'src/data/queries/searchDoiQuery'
import Link from 'next/link'

const WorksDashboard = dynamic(() => import('src/components/WorksDashboard/WorksDashboard'), { ssr: false })
const SankeyGraph = dynamic(() => import('src/components/SankeyGraph/SankeyGraph'), { ssr: false })

interface Props {
  works: Works
  showAnalytics: boolean
  showSankey?: boolean
  sankeyTitle?: string
  connectionTypesCounts?: ConnectionTypeCounts
  organizationRelationTypeCounts?: OrganizationRelationTypeCounts
  organizationRelationCountsLoading?: boolean
  showClaimStatus: boolean
  loading: boolean
  loadingFacets?: boolean
  model: string
  url: string
  hasPagination: boolean
  hasNextPage: boolean
  endCursor: string
  show?: ShowCharts
  children?: React.ReactNode
  searchBox?: React.ReactNode
}

export default function WorksListing({
  works,
  showAnalytics,
  connectionTypesCounts,
  organizationRelationTypeCounts,
  organizationRelationCountsLoading = false,
  showSankey,
  sankeyTitle = 'Contributions to Related Works',
  showClaimStatus,
  loading,
  loadingFacets = false,
  model,
  url,
  hasPagination,
  hasNextPage,
  endCursor,
  show = { publicationYear: true, resourceTypes: true, licenses: true },
  children,
  searchBox
}: Props) {

  const hasNoWorks = works.totalCount == 0
  const sankeyData = showSankey ? multilevelToSankey(works.personToWorkTypesMultilevel ?? []) : []

  const renderFacets = () => {
    return (
      <>
        <h2 className="visually-hidden">Works Search Sidebar</h2>
        {searchBox}
        <h3 className="visually-hidden">Works Search Facets</h3>
        <WorkFacets
          model={model}
          url={url}
          data={works}
          connectionTypesCounts={connectionTypesCounts}
          organizationRelationTypeCounts={organizationRelationTypeCounts}
        />
      </>
    )
  }

  const renderNoWorks = () => {
    return (
      <NoResults />
    )
  }

  const renderWorks = () => {
    if (hasNoWorks) return renderNoWorks()
    return (
      <>
        {showAnalytics && <WorksDashboard works={works} show={show} />}
        {showSankey && !loadingFacets && (
          <Row>
            <Col xs={12}>
              <SankeyGraph
                titleText={sankeyTitle}
                data={sankeyData}
                tooltipText="This chart shows the number of times the top Creators & Contributors with ORCID iDs were associated with different work types."
              />
            </Col>
          </Row>
        )}

        {works.nodes.map((doi) => (
          <Row key={doi.doi} className="mb-4 work">
            <WorkMetadata metadata={doi} linkToExternal={false} showClaimStatus={showClaimStatus} />
          </Row>
        ))}

        {hasPagination && (
          <Row>
            <Pager
              url={url}
              hasNextPage={hasNextPage}
              endCursor={endCursor}
            />
          </Row>
        )}
      </>
    )
  }

  return (
    <Row>
      <Col md={3} className={'d-none d-md-block' + (['doi.org/?'].includes(url) ? ' px-4' : ' pe-4')}>
        {(loadingFacets || organizationRelationCountsLoading) ? <Row><LoadingFacetList count={4} numberOfLines={10} /></Row> : renderFacets()}
      </Col>
      <Col md={9}>
        <h2 className="visually-hidden">Works Search Listing</h2>
        {children}
        {loading ? <Loading /> : renderWorks()}
      </Col>
    </Row>
  )
}

const SORT_OPTIONS = [
  { value: null, label: 'Relevance', appendDivider: true },
  { value: 'title', label: 'Title (A to Z)' },
  { value: '-title', label: 'Title (Z to A)', appendDivider: true },
  { value: '-citation-count', label: 'Most Cited' },
  { value: '-view-count', label: 'Most Viewed' },
  { value: '-download-count', label: 'Most Downloaded' },
] as const

export function SortBy() {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));

  const activeSort = SORT_OPTIONS.find(e => e.value === params.get('sort')) || SORT_OPTIONS[0]

  return <div className="d-flex align-items-center">
    <Dropdown>
      <Dropdown.Toggle className="border-0 m-0 bg-transparent" variant="light">
        <span className="text-secondary">Sort by:</span> {activeSort.label}
      </Dropdown.Toggle>

      <Dropdown.Menu className="remove-dropdown-margin">
        {SORT_OPTIONS.map((item) => (
          <React.Fragment key={item.value}>
            <Item value={item.value}>
              {item.label}
            </Item>
            {'appendDivider' in item && item.appendDivider && <Dropdown.Divider className="pt-1 border-0" />}
          </React.Fragment>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  </div>
}

function Item(props: {
  value: null | SortOption,
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));

  const isActive = params.get('sort') === props.value
  const isSelected = isActive

  if (isActive || !props.value) {
    // if param is present, delete from query
    params.delete('sort')
  } else {
    // otherwise replace param with new value
    params.set('sort', props.value)
  }
  params.delete('cursor')

  return <Dropdown.Item href={`${pathname}/?${params.toString()}`} className="d-inline-flex align-items-center gap-1" as={Link}>
    <FontAwesomeIcon icon={faCheck} opacity={isSelected ? 1 : 0} />
    {props.children}
  </Dropdown.Item>
}
