'use client'

import React from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import DataCiteButton from 'src/components/DataCiteButton/DataCiteButton'

type Props = {
  url: string
  isNested?: boolean
  hasNextPage: boolean
  endCursor: string
}

export default function Pager({ url, hasNextPage, endCursor }: Props) {
  const searchParams = useSearchParams() || {} as ReadonlyURLSearchParams
  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));

  const hasFirstPage = params.get('cursor')
  params.delete('cursor')
  const firstPageUrl = hasFirstPage ? url + params.toString() : undefined

  params.set('cursor', endCursor)
  const nextPageUrl = hasNextPage && endCursor ? url + params.toString() : undefined

  return (
    <Pagination className="justify-content-between">
      <DataCiteButton disabled={!hasFirstPage} href={firstPageUrl}>
        First Page
      </DataCiteButton>
      <DataCiteButton disabled={!hasNextPage} href={nextPageUrl}>
        Next Page
      </DataCiteButton>
    </Pagination>
  )
}

