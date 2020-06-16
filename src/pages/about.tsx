import React from 'react'
import Layout from '../components/Layout/Layout'
import { Grid, Carousel } from 'react-bootstrap'

const AboutPage: React.FunctionComponent = () => (
  <Layout title={process.env.NEXT_PUBLIC_TITLE}>
    <Grid fluid={true}>
      <Carousel interval={3000} controls={false}>
        <Carousel.Item>
          <img width={800} height={600} alt="800x600" src="/images/akita1.jpg" />
          <Carousel.Caption>
            <h3>Japanese Akita puppies</h3>
            <p>Available via <a href="https://commons.wikimedia.org/wiki/File:Yuki_and_Branca_-_Japanese_Akita.jpg">Wikimedia Commons</a>.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img width={800} height={534} alt="800x534" src="/images/akita2.jpg" />
          <Carousel.Caption>
            <h3>An Akita Inu lying on the ground in an office.</h3>
            <p>Available via <a href="https://commons.wikimedia.org/wiki/File:Akita_Inu_lying_on_the_ground_in_an_office.jpg">Wikimedia Commons</a>.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img width={800} height={600} alt="800x600" src="/images/akita3.jpg" />
          <Carousel.Caption>
            <h3>An eight-month-old black-and-white Akita Inu</h3>
            <p>Available via <a href="https://commons.wikimedia.org/wiki/File:Akita_black-and-white.jpg">Wikimedia Commons</a>.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Grid>
  </Layout>
)

export default AboutPage