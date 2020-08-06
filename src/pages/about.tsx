import React from 'react'
import Layout from '../components/Layout/Layout'
import { Grid, Row, Col } from 'react-bootstrap'

const AboutPage: React.FunctionComponent = () => (
  <Layout title={process.env.NEXT_PUBLIC_TITLE}>
    <Grid fluid={true}>
      <Row>
        <Col md={9} mdOffset={3}>
          <div className="panel panel-transparent">
            <div className="panel-body">
              <h3 className="member">About</h3>
              <p>
                DataCite Commons is a web search interface for the{' '}
                <a
                  href="https://doi.org/10.5438/jwvf-8a66"
                  target="_blank"
                  rel="noreferrer"
                >
                  PID Graph
                </a>
                , the graph formed by the collection of scholarly resources such
                as publications, datasets, people and research organizations,
                and their connections. The PID Graph uses persistent identifiers
                and{' '}
                <a href="https://graphql.org/" target="_blank" rel="noreferrer">
                  GraphQL
                </a>
                , with PIDs and metadata provided by DataCite, Crossref, ORCID,
                and others.
              </p>
              <p>
                DataCite Commons is work in progress and will officially launch
                in October 2020. The work is supported by funding from the
                European Union’s Horizon 2020 research and innovation programme.
              </p>
              <p>
                <a
                  href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search"
                  target="_blank"
                  rel="noreferrer"
                >
                  Provide input to the DataCite Roadmap
                </a>{' '}
                |{' '}
                <a
                  href="https://support.datacite.org/docs/datacite-search-user-documentation"
                  target="_blank"
                  rel="noreferrer"
                >
                  Information in DataCite Support
                </a>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Grid>
  </Layout>
)

export default AboutPage
