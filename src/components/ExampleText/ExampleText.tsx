import React, { PropsWithChildren } from 'react'
import { Row, Col, Alert } from 'react-bootstrap'

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

