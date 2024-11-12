import React, { PropsWithChildren } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'

export default function ExampleText({ children }: PropsWithChildren) {
  return (
    <Row>
      <Col xs={12} md={{ span: 9, offset: 3 }}>
        <Alert variant="info">
          {children}
        </Alert>
      </Col>
    </Row>
  )
}

