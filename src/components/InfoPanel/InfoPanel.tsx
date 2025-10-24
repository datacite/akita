import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InfoCard from '../InfoCard/InfoCard'
import {
  faProjectDiagram,
  faSearch,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'

const InfoPanel: React.FunctionComponent = () => {
  return (
    <Row className="my-5 justify-content-center">
      <Col md={11}>
        <Row>
          <Col xs={12} md={4}>
            <InfoCard
              icon={faProjectDiagram}
              title="What is DataCite Commons?"
              body={
                <>
                  DataCite Commons is{' '}
                  <b>a discovery, analytics, and reporting tool</b> powered by
                  the links between works, people, and organizations in DataCite
                  DOI metadata.
                </>
              }
            />
          </Col>
          <Col xs={12} md={4}>
            <InfoCard
              icon={faSearch}
              title="What can I find?"
              body={
                <>
                  Explore <b>all DataCite DOIs and a subset of Crossref DOIs</b>{' '}
                  in the Works tab. Search for People (with ORCID iDs),
                  Organizations (with ROR IDs), and Repositories (of DataCite
                  Members) in their respective tabs to explore their related
                  works.
                </>
              }
            />
          </Col>
          <Col xs={12} md={4}>
            <InfoCard
              icon={faQuestionCircle}
              title="Where can I learn more?"
              body={
                <>
                  Documentation is available in{' '}
                  <a
                    href="https://support.datacite.org/docs/datacite-commons"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <b>DataCite Support</b>
                  </a>
                  .
                </>
              }
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default InfoPanel
