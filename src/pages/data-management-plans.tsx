import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsResource from '../components/StatsResource/StatsResource'

const DataManagementPlanPage: React.FunctionComponent = () => (
  <Layout path={'/data-management-plans'} >
    <Grid fluid={true}>
      <StatsResource resource="Data Management Plan" />
    </Grid>
  </Layout>
)

export default DataManagementPlanPage
