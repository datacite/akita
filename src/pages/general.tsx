import React from 'react'
import Layout from '../components/Layout/Layout'
import StatsAll from '../components/StatsAll/StatsAll'
import { Grid } from 'react-bootstrap'

const GeneralPage: React.FunctionComponent = () => (
  <Layout path={'/general'} >
    <Grid fluid={true}>
      <StatsAll />
    </Grid>
  </Layout>
)

export default GeneralPage
