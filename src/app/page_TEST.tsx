import React from 'react'
import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchWork from 'src/components/SearchWork/SearchWork'
 
interface Props {
  searchParams: {
    query?: string
  }
}

export default function Page ({ searchParams }: Props) {
  const { query } = searchParams

  if (!query || query === '')
    return <ExampleText>
      <div>
        Search works by keyword(s) or DOI.<br /><br />

        Examples:
        <ul>
          <li><a href="/doi.org?query=climate+change">climate change</a></li>
          <li><a href="/doi.org?query=10.14454%2F3w3z-sa82">10.14454/3w3z-sa82</a></li>
        </ul>

        Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
      </div>
    </ExampleText>

  return <SearchWork searchQuery={query} />
}


