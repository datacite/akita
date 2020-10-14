import React from 'react'
import { Tabs, Tab, Alert, Row, Col, Label } from 'react-bootstrap'
import { pluralize } from '../../utils/helpers'
import { useFeature } from 'flagged'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import startCase from 'lodash/startCase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import chunk from 'lodash/chunk'

import { WorkType } from '../WorkContainer/WorkContainer'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import WorkFunding from '../WorkFunding/WorkFunding'
import WorkPerson from '../WorkPerson/WorkPerson'
import UsageChart from '../UsageChart/UsageChart'

type Props = {
  doi: WorkType
}

const DoiPresentation: React.FunctionComponent<Props> = ({ doi }) => {
  const workFunding = useFeature('workFunding')
  const downloadLink = useFeature('downloadLink')
  const [selectedOption, setSelectedOption] = React.useState('')

  if (!doi) return <Alert bsStyle="warning">No works found.</Alert>

  const showFunding =
    doi.fundingReferences && doi.fundingReferences.length > 0 && workFunding

  const claim = () => {
    const claim = doi.claims[0]
    const hasFailed = claim.state === 'failed'
    const stateColors = {
      "done": "success",
      "failed": "danger",
      "working": "info"
    }

    const claimSources = {
      "orcid_update": "Auto-Update",
      "orcid_search": "Search and Link",
    }

    return (
      <>
        <h3 className="member-results">Claim</h3>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <Row>
              <Col xs={6} md={4}>
                <Label bsStyle={stateColors[claim.state]}>{startCase(claim.state)}</Label>
              </Col>
              <Col xs={6} md={4}>
                <h5>Source</h5>
                <a
                  href="https://support.datacite.org/docs/datacite-profiles-user-documentation#orcid-permissions"
                  target="_blank"
                  rel="noreferrer"
                >
                  {claimSources[claim.sourceId]}
                </a>
                {hasFailed && (
                  <>
                    <h5>Error Message</h5>
                    {startCase(claim.errorMessages[0].title)}
                  </>
                )}
                {!hasFailed && (
                  <>
                    <h5>Claimed</h5>
                    {new Date(claim.claimed).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </>
                )}
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  }
  
  const shareLink = () => {
    const pageUrl =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
        ? 'https://commons.datacite.org/doi.org/' + doi.doi
        : 'https://commons.stage.datacite.org/doi.org/' + doi.doi

    const title = doi.titles[0]
      ? 'DataCite Commons: ' + doi.titles[0].title
      : 'DataCite Commons: No Title'

    return (
      <>
        <h3 className="member-results">Share</h3>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <Row>
              <Col xs={6} md={4}>
                <div>
                  <EmailShareButton url={pageUrl} title={title}>
                    <FontAwesomeIcon icon={faEnvelope} /> Email
                  </EmailShareButton>
                </div>
                <div>
                  <TwitterShareButton url={pageUrl} title={title}>
                    <FontAwesomeIcon icon={faTwitter} /> Twitter
                  </TwitterShareButton>
                </div>
                <div>
                  <FacebookShareButton url={pageUrl} title={title}>
                    <FontAwesomeIcon icon={faFacebook} /> Facebook
                  </FacebookShareButton>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  }

  const exportMetadata = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org'
    const showDownloadLink = doi.contentUrl && downloadLink

    return (
      <>
        <h3 className="member-results">Download</h3>
        <div className="panel panel-transparent">
          <div className="panel-body">
            <Row>
              <Col xs={6} md={4}>
                <h5>Full Metadata</h5>
                <div id="export-xml">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl +
                      '/application/vnd.datacite.datacite+xml/' +
                      doi.doi
                    }
                  >
                    DataCite XML
                  </a>
                </div>
                <div id="export-json">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl +
                      '/application/vnd.datacite.datacite+json/' +
                      doi.doi
                    }
                  >
                    DataCite JSON
                  </a>
                </div>
                <div id="export-ld" className="download">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl + '/application/vnd.schemaorg.ld+json/' + doi.doi
                    }
                  >
                    Schema.org JSON-LD
                  </a>
                </div>
              </Col>
              <Col xs={6} md={4}>
                <h5>Citation Metadata</h5>
                <div id="export-citeproc" className="download">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl +
                      '/application/vnd.citationstyles.csl+json/' +
                      doi.doi
                    }
                  >
                    Citeproc JSON
                  </a>
                </div>
                <div id="export-bibtex" className="download">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={apiUrl + '/application/x-bibtex/' + doi.doi}
                  >
                    BibTeX
                  </a>
                </div>
                <div id="export-ris" className="download">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      apiUrl + '/application/x-research-info-systems/' + doi.doi
                    }
                  >
                    RIS
                  </a>
                </div>
                {doi.types.resourceTypeGeneral === 'Software' && (
                  <div id="export-codemeta" className="download">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        apiUrl + '/application/vnd.codemeta.ld+json/' + doi.doi
                      }
                    >
                      Codemeta
                    </a>
                  </div>
                )}
              </Col>
              {showDownloadLink && (
                <Col xs={6} md={4}>
                  <h5>Content</h5>
                  <div>
                    <a href={doi.contentUrl} target="_blank" rel="noreferrer">
                      via Unpaywall
                    </a>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </>
    )
  }

  const formattedCitation = () => {
    return (
      <div>
        <div id="citation" className="input-group pull-right">
          <select
            className="cite-as"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="apa">APA</option>
            <option value="harvard-cite-them-right">Harvard</option>
            <option value="modern-language-association">MLA</option>
            <option value="vancouver">Vancouver</option>
            <option value="chicago-fullnote-bibliography">Chicago</option>
            <option value="ieee">IEEE</option>
          </select>
        </div>
        <CitationFormatter
          id={doi.doi}
          input={doi.formattedCitation}
          locale="en"
          style={selectedOption}
        ></CitationFormatter>
      </div>
    )
  }

  const viewsTabLabel = pluralize(doi.viewCount, 'View')
  const downloadsTabLabel = pluralize(doi.downloadCount, 'View')

  const viewsOverTime = doi.viewsOverTime.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))
  const downloadsOverTime = doi.downloadsOverTime.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))

  const analyticsBar = () => {
    if (doi.viewCount == 0 && doi.downloadCount == 0) return ''

    return (
      <div className="panel panel-transparent">
        <div className="panel-body nav-tabs-member">
          <Tabs className="content-tabs" id="over-time-tabs">
            {doi.viewCount > 0 && (
              <Tab
                className="views-over-time-tab"
                eventKey="viewsOverTime"
                title={viewsTabLabel}
              >
                <UsageChart
                  data={viewsOverTime}
                  counts={doi.viewCount}
                  publicationYear={doi.publicationYear}
                  type="view"
                />
              </Tab>
            )}
            {doi.downloadCount > 0 && (
              <Tab
                className="downloads-over-time-tab"
                eventKey="downloadsOverTime"
                title={downloadsTabLabel}
              >
                <UsageChart
                  data={downloadsOverTime}
                  counts={doi.downloadCount}
                  publicationYear={doi.publicationYear}
                  type="download"
                />
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <>
      <h3 className="member-results">{'https://doi.org/' + doi.doi}</h3>
      <WorkMetadata metadata={doi} linkToExternal={true}></WorkMetadata>
      {doi.creators.length > 0 && (
        <>
          <h3 className="member-results" id="work-creators">
            Creators
          </h3>
          <div className="panel panel-transparent creator">
            <div className="panel-body">
              {chunk(doi.creators, 3).map((row) => (
                <Row className="creator-list" key={row[0].name}>
                  {row.map((item) => (
                    <Col key={item.name} md={4}><WorkPerson person={item} /></Col>
                  ))}
                </Row>
              ))}
            </div>
          </div>
        </>
      )}
      {doi.contributors.length > 0 && (
        <>
          <h3 className="member-results" id="work-contributors">
            Contributors
          </h3>
          <div className="panel panel-transparent contributor">
            <div className="panel-body">
              {chunk(doi.contributors, 3).map((row) => (
                <Row className="contributor-list" key={row[0].name}>
                  {row.map((item) => (
                    <Col key={item.name} md={4}><WorkPerson person={item} /></Col>
                  ))}
                </Row>
              ))}
            </div>
          </div>
        </>
      )}
      {showFunding && (
        <h3 className="member-results" id="work-funding">
          Funding
        </h3>
      )}
      {showFunding && (
        <div className="panel panel-transparent contributor">
          <div className="panel-body">
            {chunk(doi.fundingReferences, 3).map((row) => (
              <Row className="funder-list" key={row[0].funderName}>
                {row.map((item) => (
                  <Col key={item.funderName} md={4}><WorkFunding funding={item} /></Col>
                ))}
              </Row>
            ))}
          </div>
        </div>
      )}
      {exportMetadata()}
      {doi.claims.length > 0 && (
        claim()
      )}
      {shareLink()}
      {formattedCitation()}
      {analyticsBar()}
    </>
  )
}

export default DoiPresentation
