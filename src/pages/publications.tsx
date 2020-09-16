import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsResource from '../components/StatsResource/StatsResource'

const PublicationsPage: React.FunctionComponent = () => (
  <Layout path={'/publications'} >
    <Grid fluid={true}>
      <StatsResource resource="Publication" color='#80b1d3' />
    </Grid>
  </Layout>
)

export default PublicationsPage
