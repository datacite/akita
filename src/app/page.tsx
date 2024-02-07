import React from 'react'
import apolloClient from 'src/utils/server/apolloClient'

import { Row, Col } from 'src/components/Layout'
import Error from 'src/components/Error/Server'
import ExampleText from 'src/components/ExampleText/ExampleText'
import SearchWork from 'src/components/SearchWork/Server'
import SEARCH_DOI_QUERY, { QueryData, QueryVar } from 'src/data/queries/searchDoi'

interface Props {
  searchParams: SearchParams
}

interface SearchParams extends Partial<QueryVar> {
  filterQuery?: string
}

export default async function IndexPage ({ searchParams }: Props) {
  const { query, filterQuery, ...vars } = searchParams

  // Show examply text if there is no query
  if (!query || query === '') return (
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
  )


  // Fetch data
  const queryStatement = query + (filterQuery ? ' AND ' + filterQuery : '')

  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: SEARCH_DOI_QUERY,
    variables: { query: queryStatement, ...vars },
    errorPolicy: 'all'
  })

  if (error) return (
    <Row>
      <Col md={9} mdOffset={3}>
        <Error title="An error occured." message={error.message} />
      </Col>
    </Row>
  )

  if (data.works.nodes.length == 0) return (
    <Row>
      <Col md={9} mdOffset={3}>
        <div className="alert-works">
          <Error title="No works found." message='' />
        </div>
      </Col>
    </Row>
  )

  return <SearchWork {...data.works} />
}
