import React, { useEffect, useState } from 'react'
import { useQueryState } from 'next-usequerystate'

import ExampleText from 'src/components/ExampleText/ExampleText'
import Layout from '../../components/Layout/Layout'
import SearchRepository from '../../components/SearchRepository/SearchRepository'

const RepositoryIndexPage = () => {
  const [searchQuery] = useQueryState('query')

  const [isClient, setIsClient] = useState(false)


  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <Layout path={'/doi.org'} ></Layout>

  return (
    <Layout path={'/repositories'}>
        {!searchQuery || searchQuery === '' ? (
          <ExampleText>
            <div>
            Search repositories by repository name or keyword(s).<br /><br />

              Examples:
              <ul>
                <li><a href="/repositories?query=Dryad">Dryad</a></li>
                <li><a href="/repositories?query=biology">biology</a></li>
              </ul>

              Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
            </div>
          </ExampleText>
        ) : (
          <SearchRepository searchQuery={searchQuery} />
        )}
    </Layout>
  )
}

export default RepositoryIndexPage
