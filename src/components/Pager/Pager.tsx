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
  const paramsString = params.toString()
  const firstPageUrl = paramsString ? `${url}?${paramsString}` : url

  params.set('cursor', endCursor)
  const paramsString2 = params.toString()
  const nextPageUrl = paramsString2 ? `${url}?${paramsString2}` : url

  return (
    <Pagination className="justify-content-between">
        <li>
          <DataCiteButton disabled={!hasFirstPage} href={firstPageUrl}>
            First Page
          </DataCiteButton>
        </li>
        <li>
          <DataCiteButton disabled={!hasNextPage} href={nextPageUrl}>
            Next Page
          </DataCiteButton>
        </li>
    </Pagination>
  )
}

