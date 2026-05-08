import React from 'react'

import { PeopleExampleText } from 'src/components/ExampleText/ExampleText'
import SearchPerson from 'src/components/SearchPerson/SearchPerson'
import { QueryVar } from 'src/data/queries/searchPersonQuery'

interface Props {
  searchParams: Promise<QueryVar>
}

export default async function SearchPersonPage(props: Props) {
  const searchParams = await props.searchParams;

  // Show example text if there is no query
  if (!searchParams.query || searchParams.query === '')
    return <PeopleExampleText />


  return <>
  <h1 className="visually-hidden">People Search</h1>
  <h2 className="visually-hidden">People Results</h2>
  <SearchPerson variables={searchParams} />
  </>
}
