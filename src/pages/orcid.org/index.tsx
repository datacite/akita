import React from 'react'
import { useQueryState } from 'next-usequerystate'

import Layout from '../../components/Layout/Layout'
import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchPerson from '../../components/SearchPerson/SearchPerson'

const IndexPersonPage = () => {
  const [searchQuery] = useQueryState('query')
  
  return (
    <Layout path={'/orcid.org'} >
      {(!searchQuery || searchQuery === '') ? (
        <ExampleText>
          <p>
            Search people by name, keyword(s), or ORCID iD.<br /><br />

            Examples:
            <ul>
              <li><a href="/orcid.org?query=Sofia+Maria+Hernandez+Garcia">Sofia Maria Hernandez Garcia</a></li>
              <li><a href="/orcid.org?query=0000-0001-5727-2427">0000-0001-5727-2427</a></li>
            </ul>

            Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
          </p>
        </ExampleText>
      ) : (
        <SearchPerson searchQuery={searchQuery} />
      )}
    </Layout>
  )
}

export default IndexPersonPage
