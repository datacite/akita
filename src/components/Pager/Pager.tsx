'use client'

import React from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'

type Props = {
  url: string
  isNested?: boolean
  hasNextPage: boolean
  endCursor: string
}

const Pager: React.FunctionComponent<Props> = ({
  url,
  hasNextPage,
  endCursor
}) => {
  let firstPageUrl = ''
  let hasFirstPage = false
  let nextPageUrl = ''

  const searchParams = useSearchParams() || {} as ReadonlyURLSearchParams
  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));

  if (params.get('cursor')) {
    // remove cursor query parameter for first page
    params.delete('cursor')
    firstPageUrl = url + params.toString()
    hasFirstPage = true
  }

  if (hasNextPage && endCursor) {
    // set cursor query parameter for next page
    params.set('cursor', endCursor)
    nextPageUrl = url + params.toString()
  }

  return (
    <Pagination>
      <Pagination.Item disabled={!hasFirstPage} href={firstPageUrl}>
        First Page
      </Pagination.Item>
      <Pagination.Item disabled={!hasNextPage} href={nextPageUrl}>
        Next Page
      </Pagination.Item>
    </Pagination>
  )
}

export default Pager
