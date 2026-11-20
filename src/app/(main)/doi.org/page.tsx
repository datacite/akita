'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

import SearchWork from 'src/components/SearchWork/SearchWork'
import { WorksExampleText } from 'src/components/ExampleText/ExampleText'
import { default as mapSearchParams, type SearchParams } from './mapSearchParams'
import { type QueryVar } from 'src/data/queries/searchDoiQuery'


function getQueryVariables(searchParams: URLSearchParams): QueryVar {
  return mapSearchParams(Object.fromEntries(searchParams.entries()) as SearchParams)
}

export default function SearchDoiPage() {
  const searchParams = useSearchParams()
  const variables = getQueryVariables(searchParams)


  const query = variables.query

  if (!query || query === '') {
    return <WorksExampleText />
  }

  // filterQuery stays in variables; buildQuery ANDs it onto the query once.
  return (<>
    <h1 className="visually-hidden">Works Search</h1>
    <SearchWork variables={variables} />
  </>
         );

}
