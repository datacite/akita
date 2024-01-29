import React, { useEffect, useState } from 'react'
import { useQueryState } from 'nuqs'

import Layout from '../../components/Layout/Layout'
import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchPerson from '../../components/SearchPerson/SearchPerson'

const IndexPersonPage = () => {
  const [searchQuery] = useQueryState('query')

  const [isClient, setIsClient] = useState(false)


  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <Layout path={'/doi.org'} ></Layout>
  
  return (
    <Layout path={'/orcid.org'} >
      {(!searchQuery || searchQuery === '') ? (
        <ExampleText>
          <div>
            Search people by name, keyword(s), or ORCID iD.<br /><br />

            Examples:
            <ul>
              <li><a href="/orcid.org?query=Sofia+Maria+Hernandez+Garcia">Sofia Maria Hernandez Garcia</a></li>
              <li><a href="/orcid.org?query=0000-0001-5727-2427">0000-0001-5727-2427</a></li>
            </ul>

            Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
          </div>
        </ExampleText>
      ) : (
        <SearchPerson searchQuery={searchQuery} />
      )}
    </Layout>
  )
}

export default IndexPersonPage
