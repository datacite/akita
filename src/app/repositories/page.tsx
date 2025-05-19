import React from 'react'

import { RepositoriesExampleText } from 'src/components/ExampleText/ExampleText'
import SearchRepository from 'src/components/SearchRepository/SearchRepository'
import { QueryVar } from 'src/data/queries/searchRepositoryQuery'

interface Props {
  searchParams: QueryVar
}


export default async function SearchRepositoryPage({ searchParams }: Props) {

  // Show example text if there is no query
  if (!searchParams.query || searchParams.query === '')
    return <RepositoriesExampleText />


  return <SearchRepository variables={searchParams} />
}
