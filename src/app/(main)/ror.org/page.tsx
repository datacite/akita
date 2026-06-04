'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

import { OrganizationsExampleText } from 'src/components/ExampleText/ExampleText'
import SearchOrganization from 'src/components/SearchOrganization/SearchOrganization'
import { QueryVar } from 'src/data/queries/searchOrganizationQuery'

function getQueryVariables(searchParams: URLSearchParams): QueryVar & { filterQuery?: string } {
  return {
    query: searchParams.get('query') ?? undefined,
    filterQuery: searchParams.get('filterQuery') ?? undefined,
    cursor: searchParams.get('cursor') ?? undefined,
    types: searchParams.get('types') ?? undefined,
    country: searchParams.get('country') ?? undefined,
  }
}

export default function SearchOrganizationPage() {
  const { query, filterQuery, ...variables } = getQueryVariables(useSearchParams())

  if (!query || query === '')
    return <OrganizationsExampleText />

  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  return <>
    <h1 className="visually-hidden">Organizations Search</h1>
    <SearchOrganization variables={{ query: queryStatement, ...variables }} />
  </>
}
