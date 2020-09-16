import React from 'react'
import { Row, Col } from 'react-bootstrap'

type Props = {
  dataciteCount: number
  crossrefCount: number
  crossrefApiCount: number
  orcidCount: number
  rorCount: number
}

const DataSources: React.FunctionComponent<Props> = ({
  dataciteCount,
  crossrefCount,
  crossrefApiCount,
  orcidCount,
  rorCount
}) => {
  const dataciteSource = () => {
    return (
      <Col md={3}>
        <h3 className="work">
          <a href="https://datacite.org" target="_blank" rel="noreferrer">
            DataCite
          </a>
        </h3>
        <div>{dataciteCount.toLocaleString('en-US')} Works</div>
        <div className="description">100% of identifiers and metadata.</div>
      </Col>
    )
  }

  const crossrefSource = () => {
    return (
      <Col md={3}>
        <h3 className="work">
          <a href="https://crossref.org" target="_blank" rel="noreferrer">
            Crossref
          </a>
        </h3>
        <div>{crossrefCount.toLocaleString('en-US')} Works</div>
        <div className="description">
          {((crossrefCount * 100) / crossrefApiCount).toFixed(2) + '%'} of {' '}
          identifiers and metadata. Import is ongoing.
        </div>
      </Col>
    )
  }

  const orcidSource = () => {
    return (
      <Col md={3}>
        <h3 className="work">
          <a href="https://orcid.org" target="_blank" rel="noreferrer">
            ORCID
          </a>
        </h3>
        <div>{orcidCount.toLocaleString('en-US')} People</div>
        <div className="description">
          100% of identifiers. Personal and employment metadata.
        </div>
      </Col>
    )
  }

  const rorSource = () => {
    return (
      <Col md={3}>
        <h3 className="work">
          <a href="https://ror.org" target="_blank" rel="noreferrer">
            ROR
          </a>
        </h3>
        <div>{rorCount.toLocaleString('en-US')} Organizations</div>
        <div className="description">100% of identifiers and metadata.</div>
      </Col>
    )
  }

  return (
    <Col md={9} mdOffset={3} id="data-sources">
      <h3 className="member-results">Data Sources</h3>
      <div className="panel panel-transparent">
        <div className="panel-body">
          <div className="intro">
            The following main data sources are used in DataCite Commons for a
            total of currently{' '}
            {(
              dataciteCount +
              crossrefCount +
              orcidCount +
              rorCount
            ).toLocaleString('en-US')}{' '}
            records:
          </div>
          <Row>
            {dataciteSource()}
            {crossrefSource()}
            {orcidSource()}
            {rorSource()}
          </Row>
          <div className="other">
            Additional information comes from these data sources:
            <ul>
              <li>
                <a
                  href="https://www.wikidata.org"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikidata
                </a>
                : inception year, geolocation and Twitter account for
                organizations
              </li>
              <li>
                <a
                  href="https://unpaywall.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Unpaywall
                </a>
                : download link for Open Access content via Crossref
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Col>
  )
}

export default DataSources
