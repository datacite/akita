import React from 'react'

import { RepositoriesExampleText } from 'src/components/ExampleText/ExampleText'
import SearchRepository from 'src/components/SearchRepository/SearchRepository'
import { QueryVar } from 'src/data/queries/searchRepositoryQuery'

interface Props {
  searchParams: Promise<QueryVar>
}


export default async function SearchRepositoryPage(props: Props) {
  const searchParams = await props.searchParams;

  // Show example text if there is no query
  if (!searchParams.query || searchParams.query === '')
    return <RepositoriesExampleText />


  return <SearchRepository variables={searchParams} />
}
