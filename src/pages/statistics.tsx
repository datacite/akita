import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsAll from '../components/StatsAll/StatsAll'

const StatisticsPage: React.FunctionComponent = () => (
  <Layout path={'/statistics'} >
    <Grid fluid={true}>
      <StatsAll />
    </Grid>
  </Layout>
)

export default StatisticsPage
