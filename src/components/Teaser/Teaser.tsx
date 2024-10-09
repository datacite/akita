import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'

type Props = {
  title: string
}

const Teaser: React.FunctionComponent<Props> = ({ title }) => {
  return (
    <Row>
      <Col xs={12} md={{ span: 9, offset: 3 }}>
        <Alert variant="info">
          Search {title} by keyword(s) and/or identifier. Documentation is available in <a href="https://support.datacite.org/docs/datacite-commons" target="_blank" rel="noreferrer">DataCite Support.</a>
        </Alert>
      </Col>
    </Row>
  )
}

export default Teaser
