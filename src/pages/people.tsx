import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsPerson from '../components/StatsPerson/StatsPerson'

const PeoplePage: React.FunctionComponent = () => (
  <Layout path={'/people'} >
    <Grid fluid={true}>
      <StatsPerson />
    </Grid>
  </Layout>
)

export default PeoplePage
