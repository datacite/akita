import React from 'react'
import Layout from '../components/Layout/Layout'
import Beta from '../components/Beta/Beta'
import { Grid } from 'react-bootstrap'

const BetaPage: React.FunctionComponent = () => (
  <Layout path={'/beta'} >
    <Grid fluid={true}>
      <Beta />
    </Grid>
  </Layout>
)

export default BetaPage
