import React from 'react'

import { WorksExampleText } from 'src/components/ExampleText/ExampleText'
import SearchWork from 'src/components/SearchWork/SearchWork'
import { QueryVar } from 'src/data/queries/searchDoiQuery'

interface Props {
  searchParams: SearchParams
}

interface SearchParams extends Partial<QueryVar> {
  filterQuery?: string
}

export default async function IndexPage({ searchParams }: Props) {
  const { query, filterQuery, ...vars } = searchParams

  // Show example text if there is no query
  if (!query || query === '')
    return <WorksExampleText />


  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  return <SearchWork variables={{ query: queryStatement, ...vars }} />
}
