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

  const buildUrl = (baseUrl: string, query: URLSearchParams) => {
    const qs = query.toString()
    if (!qs) return baseUrl
    const sep = baseUrl.includes('?') ? (baseUrl.endsWith('?') || baseUrl.endsWith('&') ? '' : '&') : '?'
    return `${baseUrl}${sep}${qs}`
  }
  const hasFirstPage = params.get('cursor')
  params.delete('cursor')
  const firstPageUrl = buildUrl(url, params)

  params.set('cursor', endCursor)
  const nextPageUrl = buildUrl(url, params)

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

