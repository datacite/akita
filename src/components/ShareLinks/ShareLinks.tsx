'use client'

import React from 'react'
import { Row, Col } from 'src/components/Layout'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

type Props = {
  url: string
  title?: string
}

const ShareLinks: React.FunctionComponent<Props> = ({ url, title }) => {

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/' + url
      : 'https://commons.stage.datacite.org/' + url

  const pageTitle = title
    ? 'DataCite Commons: ' + title
    : 'DataCite Commons: No Title'

  const ShareLinks = () => <>
    <h3 className="member-results" id="share">Share</h3>
    <div className="panel panel-transparent share">
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
    </div>
  </>

  return (
    <>
      <ShareLinks />
    </>
  )
}

export default ShareLinks
