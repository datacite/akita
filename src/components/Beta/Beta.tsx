import React from 'react'
import { Row, Col } from 'src/components/Layout'

const Beta = () => {
  return (
    <Row>
      <Col md={9} mdOffset={3}>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <h3 className="member">Beta Tester Program</h3>
            <p>
              Please stay tuned.
            </p>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default Beta
