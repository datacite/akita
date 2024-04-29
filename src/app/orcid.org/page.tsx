import React from 'react'
import Link from 'next/link'

import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchPerson from 'src/components/SearchPerson/SearchPerson'
import { QueryVar } from 'src/data/queries/searchPersonQuery'

interface Props {
  searchParams: QueryVar
}

export default async function SearchPersonPage ({ searchParams }: Props) {

  // Show examply text if there is no query
  if (!searchParams.query || searchParams.query === '') return (
    <ExampleText>
      <div>
        Search people by name, keyword(s), or ORCID iD.<br /><br />

        Examples:
        <ul>
          <li><Link href="/orcid.org?query=Sofia+Maria+Hernandez+Garcia">Sofia Maria Hernandez Garcia</Link></li>
          <li><Link href="/orcid.org?query=0000-0001-5727-2427">0000-0001-5727-2427</Link></li>
        </ul>

        Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
      </div>
    </ExampleText>
  )


  return <SearchPerson variables={searchParams} />
}
