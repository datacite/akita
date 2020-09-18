import React from 'react'
import Layout from '../components/Layout/Layout'
import StatsAll from '../components/StatsAll/StatsAll'
import { Grid } from 'react-bootstrap'

const OverviewPage: React.FunctionComponent = () => (
  <Layout path={'/overview'} >
    <Grid fluid={true}>
      <StatsAll />
    </Grid>
  </Layout>
)

export default OverviewPage
