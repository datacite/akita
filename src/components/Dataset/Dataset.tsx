import React from 'react'
import { Row, Col } from 'react-bootstrap'

type Props = {
  title: string
}

const Dataset: React.FunctionComponent<Props> = ({ title }) => {
  return (
    <Row>
      <Col md={9} mdOffset={3}>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <h3 className="member">{title}</h3>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default Dataset
