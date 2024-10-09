import React from 'react'
import About from 'src/components/About/About'
import { Container } from 'react-bootstrap'

export default function AboutPage() {
  return (
    <Container fluid>
      <About title={'About'} />
    </Container>
  )
}
