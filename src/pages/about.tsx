import React from 'react'
import Layout from '../components/Layout/Layout'
import About from '../components/About/About'
import { Grid } from 'react-bootstrap'

const AboutPage: React.FunctionComponent = () => (
  <Layout path={'/about'} >
    <Grid fluid={true}>
      <About title={'About'} />
    </Grid>
  </Layout>
)

export default AboutPage
