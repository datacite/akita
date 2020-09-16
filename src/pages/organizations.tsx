import React from 'react'
import { Grid } from 'react-bootstrap'

import Layout from '../components/Layout/Layout'
import StatsOrganization from '../components/StatsOrganization/StatsOrganization'

const OrganizationsPage: React.FunctionComponent = () => (
  <Layout path={'/organizations'} >
    <Grid fluid={true}>
      <StatsOrganization />
    </Grid>
  </Layout>
)

export default OrganizationsPage
