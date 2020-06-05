import React from 'react';

import { Grid, Row, Col } from 'react-bootstrap';

type Props = {
  title: string;
  message: string;
};

const Error: React.FunctionComponent<Props> = ({title, message}) => {
  return (
    <div className="Error">
      <h2>{title}</h2>
      <Grid className="content">
        <Row>
          <Col>
          <p>{message}</p>
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

export default Error;
