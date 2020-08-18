import React from 'react'
import { useQueryState } from 'next-usequerystate'
import { Col, Alert } from 'react-bootstrap'

import Layout from '../../components/Layout/Layout'
import SearchPerson from '../../components/SearchPerson/SearchPerson'

const IndexPersonPage = () => {
  const [searchQuery] = useQueryState<string>('query')
  
  return (
    <Layout title={process.env.NEXT_PUBLIC_TITLE}>
      <React.Fragment>
        {!searchQuery || searchQuery === '' ? (
          <Col md={9} mdOffset={3}>
            <Alert bsStyle="info">
              Search people by keyword(s) and/or identifier. Documentation is available in <a href="https://support.datacite.org/docs/api-queries" target="_blank" rel="noreferrer">DataCite Support.</a>
            </Alert>
          </Col>
        ) : (
          <SearchPerson searchQuery={searchQuery} />
        )}
      </React.Fragment>
    </Layout>
  )
}

export default IndexPersonPage
