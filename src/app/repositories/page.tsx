import React from 'react'
import Link from 'next/link'

import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchRepository from 'src/components/SearchRepository/SearchRepository'
import { QueryVar } from 'src/data/queries/searchRepositoryQuery'

interface Props {
  searchParams: QueryVar
}


export default async function SearchRepositoryPage ({ searchParams }: Props) {

  // Show example text if there is no query
  if (!searchParams.query || searchParams.query === '') return (
    <ExampleText>
      <div>
        Search repositories by repository name or keyword(s).<br /><br />

        Examples:
        <ul>
          <li><Link href="/repositories?query=Dryad">Dryad</Link></li>
          <li><Link href="/repositories?query=biology">biology</Link></li>
        </ul>

        Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
      </div>
    </ExampleText>
  )


  return <SearchRepository variables={searchParams} />
  // return <SearchOrganization variables={{ query: queryStatement, ...variables }} />
}
