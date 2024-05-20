import React from 'react'
import { Row, Col } from 'src/components/Layout'

type Props = {
  title: string
}

const About: React.FunctionComponent<Props> = ({ title }) => {
  return (
    <Row>
      <Col md={9} mdOffset={3}>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <h3 className="member">{title}</h3>
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
              as publications, datasets, people and research organizations, and
              their connections. The PID Graph uses persistent identifiers and{' '}
              <a href="https://graphql.org/" target="_blank" rel="noreferrer">
                GraphQL
              </a>
              , with PIDs and metadata provided by DataCite, Crossref, ORCID,
              and others.
            </p>
            <p>
              DataCite Commons was officially launched in October 2020 by the{' '}
              <a
                href="https://www.project-freya.eu/en/about/mission"
                target="_blank"
                rel="noreferrer"
              >
                FREYA project
              </a>
              , funded by the European Union’s Horizon 2020 research and
              innovation programme under grant agreement No 777523.
            </p>
            <p>
              DataCite Commons is partially supported by the{' '}
              <a
                href="https://parsecproject.org"
                target="_blank"
                rel="noreferrer"
              >
                PARSEC project
              </a>{' '}
              funded by the Belmont Forum (Collaborative Research Action on
              Science-Driven e-Infrastructures Innovation) managed through the
              National Science Foundation (Grant ID 1929464).
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
                href="https://support.datacite.org/docs/datacite-commons"
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
  )
}

export default About
