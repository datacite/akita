import React from 'react'

import { OrganizationsExampleText } from 'src/components/ExampleText/ExampleText'
import SearchOrganization from 'src/components/SearchOrganization/SearchOrganization'
import { QueryVar } from 'src/data/queries/searchOrganizationQuery'

interface Props {
  searchParams: SearchParams
}

interface SearchParams extends Partial<QueryVar> {
  filterQuery?: string
}

export default async function SearchOrganizationPage({ searchParams }: Props) {
  const { query, filterQuery, ...variables } = searchParams

  // Show example text if there is no query
  if (!query || query === '')
    return <OrganizationsExampleText />


  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  return <SearchOrganization variables={{ query: queryStatement, ...variables }} />
}
