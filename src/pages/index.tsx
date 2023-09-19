import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Layout from '../components/Layout/Layout'
import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchWork from '../components/SearchWork/SearchWork'

const IndexPage = () => {
  const [searchQuery] = useQueryState('query')

  return (
    <Layout path={'/doi.org'} >
      {!searchQuery || searchQuery === '' ? (
        <ExampleText>
          <p>
            Search works by keyword(s) or DOI.<br /><br />
          </p>
            Examples:
            <ul>
              <li><a href="/doi.org?query=climate+change">climate change</a></li>
              <li><a href="/doi.org?query=10.14454%2F3w3z-sa82">10.14454/3w3z-sa82</a></li>
            </ul>

          <p>
            Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
          </p>
        </ExampleText>
      ) : (
        <SearchWork searchQuery={searchQuery} />
      )}
    </Layout>
  )
}

export default IndexPage
