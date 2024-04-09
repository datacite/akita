import React from 'react'
import Link from 'next/link'

import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchWork from 'src/components/SearchWork/SearchWork'
import { QueryVar } from 'src/data/queries/searchDoiQuery'

interface Props {
  searchParams: SearchParams
}

interface SearchParams extends Partial<QueryVar> {
  filterQuery?: string
}

export default async function SearchDoiPage ({ searchParams }: Props) {
  const { query, filterQuery, ...vars } = searchParams

  // Show examply text if there is no query
  if (!query || query === '') return (
    <ExampleText>
      <div>
        Search works by keyword(s) or DOI.<br /><br />

        Examples:
        <ul>
          <li><Link href="/doi.org?query=climate+change">climate change</Link></li>
          <li><Link href="/doi.org?query=10.14454%2F3w3z-sa82">10.14454/3w3z-sa82</Link></li>
        </ul>

        Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
      </div>
    </ExampleText>
  )


  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  return <SearchWork variables={{ query: queryStatement, ...vars }} />
}
