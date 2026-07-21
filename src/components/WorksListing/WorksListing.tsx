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
import { faSortAlphaAsc, faSortAlphaDesc, faSortAmountAsc, faSortNumericAsc, faSortNumericDesc, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useSearchParams } from 'next/navigation'
import { VALID_SORT_OPTIONS } from 'src/data/queries/searchDoiQuery'

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



const A_TO_Z = 'A to Z'
const Z_TO_A = 'Z to A'
const NEWEST_FIRST = 'newest first'
const OLDEST_FIRST = 'oldest first'
const HIGH_TO_LOW = 'high to low'
const LOW_TO_HIGH = 'low to high'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance (default)', order: undefined, icon: faSortAmountAsc },
  { value: '-published', label: 'Published', order: NEWEST_FIRST, icon: faSortNumericDesc },
  { value: 'published', label: 'Published', order: OLDEST_FIRST, icon: faSortNumericAsc },
  // { value: 'name', label: 'DOI Name', order: A_TO_Z, icon: faSortAlphaAsc },
  // { value: '-name', label: 'DOI Name', order: Z_TO_A, icon: faSortAlphaDesc },
  { value: 'title', label: 'Title', order: A_TO_Z, icon: faSortAlphaAsc },
  { value: '-title', label: 'Title', order: Z_TO_A, icon: faSortAlphaDesc },
  // { value: '-created', label: 'Created', order: NEWEST_FIRST, icon: faSortNumericDesc },
  // { value: 'created', label: 'Created', order: OLDEST_FIRST, icon: faSortNumericAsc },
  // { value: '-updated', label: 'Updated', order: NEWEST_FIRST, icon: faSortNumericDesc },
  // { value: 'updated', label: 'Updated', order: OLDEST_FIRST, icon: faSortNumericAsc },
  { value: '-citation-count', label: 'Most Cited', order: undefined, icon: faSortNumericDesc },
  // { value: 'citation-count', label: 'Citation Count', order: LOW_TO_HIGH, icon: faSortNumericAsc },
  { value: '-view-count', label: 'Most Viewed', order: undefined, icon: faSortNumericDesc },
  // { value: 'view-count', label: 'View Count', order: LOW_TO_HIGH, icon: faSortNumericAsc },
  { value: '-download-count', label: 'Most Downloaded', order: undefined, icon: faSortNumericDesc },
  // { value: 'download-count', label: 'Download Count', order: LOW_TO_HIGH, icon: faSortNumericAsc },
] as const

export function SortBy() {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));

  const activeSort = SORT_OPTIONS.find(e => e.value === params.get('sort')) || { label: 'Sort by...', icon: faSortAmountAsc }

  return <Dropdown>
    <Dropdown.Toggle className="border-0 m-0" variant="light">
      <FontAwesomeIcon icon={activeSort.icon} /> {activeSort.label}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {SORT_OPTIONS.map((item) => (
        <Item
          key={item.value}
          value={item.value}
          order={item.order}
          icon={item.icon}
        >
          {item.label}
        </Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
}

function Item(props: {
  value: typeof VALID_SORT_OPTIONS[number],
  order?: string,
  icon: IconDefinition,
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));

  const isActive = params.get('sort') == props.value

  if (isActive) {
    // if param is present, delete from query
    params.delete('sort')
  } else {
    // otherwise replace param with new value
    params.set('sort', props.value)
  }
  params.delete('cursor')

  return <Dropdown.Item href={`${pathname}/?${params.toString()}`} active={isActive} className="d-inline-flex align-items-center gap-1">
    <FontAwesomeIcon className={!isActive ? "text-secondary" : ""} icon={props.icon} /> {props.children}
    {props.order && <span className={`${!isActive ? "text-secondary" : ""} ms-auto text-end ps-4`}>{props.order}</span>}
  </Dropdown.Item>
}
