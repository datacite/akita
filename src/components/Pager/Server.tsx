import React from 'react'
import { Pagination } from 'react-bootstrap'
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
  endCursor,
  // isNested
}) => {
  let firstPageUrl = ''
  let hasFirstPage = false
  let nextPageUrl = ''

  const params = useSearchParams() || {} as ReadonlyURLSearchParams

  if (params.get('cursor')) {
    // remove cursor query parameter for first page
    // params.delete('cursor')
    firstPageUrl = url + params.toString()
    hasFirstPage = true
  }

  if (hasNextPage && endCursor) {
    // set cursor query parameter for next page
    // params.set('cursor', endCursor)
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
