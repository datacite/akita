import React from 'react'

import { PeopleExampleText } from 'src/components/ExampleText/ExampleText'
import SearchPerson from 'src/components/SearchPerson/SearchPerson'
import { QueryVar } from 'src/data/queries/searchPersonQuery'

interface Props {
  searchParams: Promise<QueryVar>
}

function searchOrExampleText(searchParams: QueryVar) {
  if (!searchParams.query || searchParams.query === '')
    return <PeopleExampleText />

  return <SearchPerson variables={searchParams} />
}

export default async function SearchPersonPage(props: Props) {
  const searchParams = await props.searchParams;

  // Show example text if there is no query
  return <>
    <h1 className="visually-hidden">People Search</h1>
    {searchOrExampleText(searchParams)}
  </>
}
