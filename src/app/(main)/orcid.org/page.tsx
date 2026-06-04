'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

import { PeopleExampleText } from 'src/components/ExampleText/ExampleText'
import SearchPerson from 'src/components/SearchPerson/SearchPerson'
import { QueryVar } from 'src/data/queries/searchPersonQuery'

function getQueryVariables(searchParams: URLSearchParams): QueryVar {
  return {
    query: searchParams.get('query') ?? '',
    cursor: searchParams.get('cursor') ?? undefined,
  }
}

function searchOrExampleText(searchParams: QueryVar) {
  if (!searchParams.query || searchParams.query.trim() === '')
    return <PeopleExampleText />

  return <SearchPerson variables={searchParams} />
}

export default function SearchPersonPage() {
  const variables = getQueryVariables(useSearchParams())

  return <>
    <h1 className="visually-hidden">People Search</h1>
    {searchOrExampleText(variables)}
  </>
}
