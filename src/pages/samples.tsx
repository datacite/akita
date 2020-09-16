import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsResource from '../components/StatsResource/StatsResource'

const SamplePage: React.FunctionComponent = () => (
  <Layout path={'/samples'} >
    <Grid fluid={true}>
      <StatsResource resource="Sample" />
    </Grid>
  </Layout>
)

export default SamplePage
