import React from 'react'
import { useQueryState } from 'next-usequerystate'

import ExampleText from 'src/components/ExampleText/ExampleText'
import Layout from '../../components/Layout/Layout'
import SearchOrganization from '../../components/SearchOrganization/SearchOrganization'

const OrganizationIndexPage = () => {
  const [searchQuery] = useQueryState('query')

  return (
    <Layout path={'/ror.org'}>
      {!searchQuery || searchQuery === '' ? (
        <ExampleText>
          <div>
            Search organizations by organization name, keyword(s), or ROR ID.<br /><br />

            Examples:
            <ul>
              <li><a href="/ror.org?query=British+Library">British Library</a></li>
              <li><a href="/ror.org?query=https%3A%2F%2Fror.org%2F05dhe8b71">https://ror.org/05dhe8b71</a></li>
            </ul>

            Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
          </div>
        </ExampleText>
      ) : (
        <SearchOrganization searchQuery={searchQuery} />
      )}
    </Layout>
  )
}

export default OrganizationIndexPage
