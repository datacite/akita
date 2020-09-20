import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsAll from '../components/StatsAll/StatsAll'

const OverviewPage: React.FunctionComponent = () => (
  <Layout path={'/overview'} >
    <Grid fluid={true}>
      <StatsAll />
    </Grid>
  </Layout>
)

export default OverviewPage
