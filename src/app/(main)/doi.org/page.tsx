'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

import SearchWork from 'src/components/SearchWork/SearchWork'
import { WorksExampleText } from 'src/components/ExampleText/ExampleText'
import mapSearchParams, { type SearchParams } from './mapSearchParams'


function getQueryVariables(searchParams: URLSearchParams): SearchParams {
  return mapSearchParams(Object.fromEntries(searchParams.entries()) as any)
}
export default function SearchDoiPage() {
  const searchParams = useSearchParams()
  const variables = getQueryVariables(searchParams)


  const query = variables.query
  const filterQuery = variables.filterQuery

  if (!query || query === '') {
    return <WorksExampleText />
  }

  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  return <SearchWork variables={{ ...variables, query: queryStatement }} />
}
