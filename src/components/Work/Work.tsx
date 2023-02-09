import React from 'react'
import { Tabs, Tab, Alert, Row, Col } from 'react-bootstrap'
import { pluralize } from '../../utils/helpers'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

import { WorkType } from '../../pages/doi.org/[...doi]'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import UsageChart from '../UsageChart/UsageChart'
import Claim from '../Claim/Claim'

type Props = {
  doi: WorkType
}

const DoiPresentation: React.FunctionComponent<Props> = ({ doi }) => {
  const [selectedOption, setSelectedOption] = React.useState('')

  if (!doi) return <Alert bsStyle="warning">No works found.</Alert>

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/doi.org/' + doi.doi
      : 'https://commons.stage.datacite.org/doi.org/' + doi.doi

  const title = doi.titles[0]
    ? 'DataCite Commons: ' + doi.titles[0].title
    : 'DataCite Commons: No Title'

  const shareLink = () => {
    return (
      <>
        <h3 className="member-results" id="share">
          Share
        </h3>
        <div className="panel panel-transparent share">
          <div className="panel-body">
            <Row>
              <Col className="share-list" xs={6} md={4}>
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
  const downloadsTabLabel = pluralize(doi.downloadCount, 'Download')

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
      <WorkMetadata metadata={doi} linkToExternal={true} showClaimStatus={false}></WorkMetadata>
      { doi.registrationAgency.id == "datacite" && ( 
        <Claim doi_id={doi.doi} />
      )}
      {shareLink()}
      {formattedCitation()}
      {analyticsBar()}
    </>
  )
}

export default DoiPresentation
