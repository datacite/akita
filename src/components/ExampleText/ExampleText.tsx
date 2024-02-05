import React, { PropsWithChildren } from 'react'
import { Row, Col, Alert } from 'src/components/Layout'

const ExampleText: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <Row>
      <Col xs={12} md={9} mdOffset={3}>
        <Alert bsStyle="info">
          {children}
        </Alert>
      </Col>
    </Row>
  )
}

export default ExampleText
