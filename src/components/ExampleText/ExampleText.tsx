import React, { PropsWithChildren } from 'react'
import { Row, Col, Alert } from 'src/components/Layout-4'

export default function ExampleText({ children }: PropsWithChildren) {
  return (
    <Row>
      <Col xs={12} md={{ span: 9, offset: 3 }}>
        <Alert variant="info">
          {/* Children technically incompatible until react-bootsrap version 3, so ignore the error for now */}
          {/* @ts-ignore */}
          {children}
        </Alert>
      </Col>
    </Row>
  )
}

