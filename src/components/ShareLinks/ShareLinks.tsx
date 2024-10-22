'use client'

import React from 'react'
import { Col } from 'react-bootstrap'
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

export default function ShareLinks({ url, title }: Props) {

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/' + url
      : 'https://commons.stage.datacite.org/' + url

  const pageTitle = title
    ? 'DataCite Commons: ' + title
    : 'DataCite Commons: No Title'

  return (
    <>
      <Col xs={12}>
        <h3 className="member-results" id="share">Share</h3>
      </Col>
      <Col className="share-list" xs={12}>
        <EmailShareButton url={pageUrl} title={pageTitle}>
          <FontAwesomeIcon icon={faEnvelope} /> Email
        </EmailShareButton>
      </Col>
      <Col className="share-list" xs={12}>
        <TwitterShareButton url={pageUrl} title={pageTitle}>
          <FontAwesomeIcon icon={faTwitter} /> Twitter
        </TwitterShareButton>
      </Col>
      <Col className="share-list" xs={12}>
        <FacebookShareButton url={pageUrl} title={pageTitle}>
          <FontAwesomeIcon icon={faFacebook} /> Facebook
        </FacebookShareButton>
      </Col>
    </>
  )
}

