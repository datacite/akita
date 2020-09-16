import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsResource from '../components/StatsResource/StatsResource'

const InstrumentPage: React.FunctionComponent = () => (
  <Layout path={'/instruments'} >
    <Grid fluid={true}>
      <StatsResource resource="Instrument" />
    </Grid>
  </Layout>
)

export default InstrumentPage
