import React from 'react'
import Link from 'next/link'

import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchOrganization from 'src/components/SearchOrganization/SearchOrganization'
import { QueryVar } from 'src/data/queries/searchOrganizationQuery'

interface Props {
  searchParams: SearchParams
}

interface SearchParams extends Partial<QueryVar> {
  filterQuery?: string
}

export default async function SearchDoiPage ({ searchParams }: Props) {
  const { query, filterQuery, ...variables } = searchParams

  // Show examply text if there is no query
  if (!query || query === '') return (
    <ExampleText>
      <div>
        Search organizations by organization name, keyword(s), or ROR ID.<br /><br />

        Examples:
        <ul>
          <li><Link href="/ror.org?query=British+Library">British Library</Link></li>
          <li><Link href="/ror.org?query=https%3A%2F%2Fror.org%2F05dhe8b71">https://ror.org/05dhe8b71</Link></li>
        </ul>

        Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
      </div>
    </ExampleText>
  )


  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  return <SearchOrganization variables={{ query: queryStatement, ...variables }} />
}
