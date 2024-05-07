import React from 'react'
import About from 'src/components/About/About'
import { Grid } from 'src/components/Layout'

export default function AboutPage () {
  return (
    <Grid fluid={true}>
      <About title={'About'} />
    </Grid>
  )
}
