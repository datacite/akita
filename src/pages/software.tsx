import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsResource from '../components/StatsResource/StatsResource'

const SoftwarePage: React.FunctionComponent = () => (
  <Layout path={'/software'} >
    <Grid fluid={true}>
      <StatsResource resource='Software' color='#bebada'/>
    </Grid>
  </Layout>
)

export default SoftwarePage
