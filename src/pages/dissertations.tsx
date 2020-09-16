import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsResource from '../components/StatsResource/StatsResource'

const DissertationPage: React.FunctionComponent = () => (
  <Layout path={'/dissertations'} >
    <Grid fluid={true}>
      <StatsResource resource="Dissertation" />
    </Grid>
  </Layout>
)

export default DissertationPage
