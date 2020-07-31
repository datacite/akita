import * as React from 'react'
import {  Pagination } from 'react-bootstrap'
import { useRouter } from 'next/router'

type Props = {
  url: string
  isNested?: boolean
  hasNextPage: boolean
  endCursor: string
}

const Pager: React.FunctionComponent<Props> = ({url, hasNextPage, endCursor, isNested}) => {
  const router = useRouter()
  if (!router) return (null) 


  let firstPageUrl = null
  let hasFirstPage = false
  let nextPageUrl = null
  // let hasNextPage = false

  // get current query parameters from next router
  
  // let params = new URLSearchParams(router.query as any)
  let params = isNested ? new URLSearchParams("") : new URLSearchParams(router.query as any)

  if (params.get('cursor')) {
    // remove cursor query parameter for first page
    params.delete('cursor')
    firstPageUrl = url + params.toString()
    hasFirstPage = typeof(firstPageUrl) === 'string'
  }

  if (hasNextPage && endCursor) {
    // set cursor query parameter for next page
    params.set('cursor', endCursor)
    nextPageUrl = url + params.toString()
    hasNextPage = typeof(nextPageUrl) === 'string'
  }

  return ( 
    <Pagination>
      <Pagination.Item disabled={!hasFirstPage} href={firstPageUrl}>First Page</Pagination.Item>
      <Pagination.Item disabled={!hasNextPage} href={nextPageUrl}>Next Page</Pagination.Item>
    </Pagination>
  )
}
 
export default Pager;