import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsResource from '../components/StatsResource/StatsResource'

const PreprintPage: React.FunctionComponent = () => (
  <Layout path={'/preprints'} >
    <Grid fluid={true}>
      <StatsResource resource="Preprint" />
    </Grid>
  </Layout>
)

export default PreprintPage
