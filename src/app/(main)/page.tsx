'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

import { WorksExampleText } from 'src/components/ExampleText/ExampleText'
import SearchWork from 'src/components/SearchWork/SearchWork'
import { default as mapSearchParams, type SearchParams } from './doi.org/mapSearchParams'
import { type QueryVar } from 'src/data/queries/searchDoiQuery'

function getQueryVariables(searchParams: URLSearchParams): QueryVar {
  return mapSearchParams(Object.fromEntries(searchParams.entries()) as SearchParams)
}

export default function IndexPage() {
  const searchParams = useSearchParams()
  const variables = getQueryVariables(searchParams)

  const query = variables.query

  if (!query || query === '') {
    return <WorksExampleText />
  }

  // filterQuery stays in variables; buildQuery ANDs it onto the query once.
  return <SearchWork variables={variables} />
}
