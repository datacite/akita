import React, { useEffect, useState } from 'react'
import { useQueryState } from 'nuqs'

import Layout from '../../components/Layout/Layout'
import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchWork from '../../components/SearchWork/SearchWork'

const IndexPage = () => {
  const [searchQuery] = useQueryState('query')

  const [isClient, setIsClient] = useState(false)


  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <Layout path={'/doi.org'} ></Layout>

  return (
    <Layout path={'/doi.org'} >
      {!searchQuery || searchQuery === '' ? (
        <ExampleText>
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
      ) : (
        <SearchWork searchQuery={searchQuery} />
      )}
    </Layout>
  )
}

export default IndexPage
