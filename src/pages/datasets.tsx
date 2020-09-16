import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsResource from '../components/StatsResource/StatsResource'

const DatasetsPage: React.FunctionComponent = () => (
  <Layout path={'/datasets'} >
    <Grid fluid={true}>
      <StatsResource resource='Dataset' color='#fb8072'/>
    </Grid>
  </Layout>
)

export default DatasetsPage
