import React from 'react'
import { Row, Col } from 'react-bootstrap'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import useSWR from 'swr'

type Props = {
  url: string
  title?: string
}

const DownloadReports: React.FunctionComponent<Props> = ({ url, title }) => {

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/' + url
      : 'https://commons.stage.datacite.org/' + url

  const pageTitle = title
    ? 'DataCite Commons: ' + title
    : 'DataCite Commons: No Title'
  
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error, isLoading } = useSWR('/api/download-reports', fetcher)
  console.log(data)


  const downloadReports = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org'
  
    return (
      <div className="panel panel-transparent download-reports">
        <div className="panel-body">
          <Row>
            <Col className="download-list" id="full-metadata" xs={12}>
              <div id="export-xml">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    apiUrl +
                    '/dois?query=%22german+internet+panel%22&data-center-id=gesis.gesis&style=apa&page[size]=200'
                    // '/application/vnd.datacite.datacite+xml/' +
                    // work.doi
                  }
                  // https://api.datacite.org/dois?query=%22german+internet+panel%22&data-center-id=gesis.gesis&style=apa&page[size]=200
                >
                  Related Works
                </a>
              </div>
              <div id="export-json">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    '/api/download-reports'
                  }
                >
                  Abstracts
                </a>
              </div>
              <div id="export-ld" className="download">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    apiUrl + '/application/vnd.schemaorg.ld+json/' // + work.doi
                  }
                >
                  Funders
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  return (
    <>
      <h3 className="member-results">Download Reports</h3>
      {downloadReports()}
      {/* <div className="panel panel-transparent share">
        <div className="panel-body">
          <Row>
            <Col className="share-list" xs={12}>
              <div>
                <EmailShareButton url={pageUrl} title={pageTitle}>
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </EmailShareButton>
              </div>
              <div>
                <TwitterShareButton url={pageUrl} title={pageTitle}>
                  <FontAwesomeIcon icon={faTwitter} /> Twitter
                </TwitterShareButton>
              </div>
              <div>
                <FacebookShareButton url={pageUrl} title={pageTitle}>
                  <FontAwesomeIcon icon={faFacebook} /> Facebook
                </FacebookShareButton>
              </div>
            </Col>
          </Row>
        </div>
      </div> */}
    </>
  )
}

export default DownloadReports
