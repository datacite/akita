import React from 'react'

import { PeopleExampleText } from 'src/components/ExampleText/ExampleText'
import SearchPerson from 'src/components/SearchPerson/SearchPerson'
import { QueryVar } from 'src/data/queries/searchPersonQuery'

interface Props {
  searchParams: QueryVar
}

export default async function SearchPersonPage({ searchParams }: Props) {

  // Show example text if there is no query
  if (!searchParams.query || searchParams.query === '')
    return <PeopleExampleText />


  return <SearchPerson variables={searchParams} />
}
