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

import OrganizationMetadata from '../OrganizationMetadata/OrganizationMetadata'
import { pluralize, rorFromUrl } from '../../utils/helpers'
import { Works } from '../SearchWork/SearchWork'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

export interface OrganizationRecord {
  id: string
  name: string
  memberId: string
  memberRoleId: string
  alternateName: string[]
  inceptionYear: number
  url: string
  wikipediaUrl: string
  twitter: string
  types: string[]
  citationCount: number
  viewCount: number
  downloadCount: number
  country: {
    id: string
    name: string
  }
  geolocation: {
    pointLongitude: number
    pointLatitude: number
  }
  identifiers: {
    identifier: string
    identifierType: string
  }[]
  works?: Works
}

type Props = {
  organization: OrganizationRecord
}

const Organization: React.FunctionComponent<Props> = ({
  organization
}) => {
  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/ror.org' + rorFromUrl(organization.id)
      : 'https://commons.stage.datacite.org/ror.org' + rorFromUrl(organization.id)

  const title = organization.name
    ? 'DataCite Commons: ' + organization.name
    : 'DataCite Commons: No Name'
  
  const statSummary = () => {
    const works = pluralize(organization.works.totalCount, 'Work').split(' ')
    const citations = pluralize(organization.citationCount, 'Citation').split(' ')
    const views = pluralize(organization.viewCount, 'View').split(' ')
    const downloads = pluralize(organization.downloadCount, 'Download').split(' ')

    const stat = (count: string, name: string, link?: string) => {
      if (Number(count) <= 0) return null

      const helpIcon = () =>
        // <OverlayTrigger 
        //   placement="top"
        //   overlay={<Tooltip id="tooltipAuthors">This list includes only Authors with ORCID ids.</Tooltip>}>
          <a
            href={`https://support.datacite.org/docs/${link}`}
            target="_blank"
            rel="noreferrer"
            className='help-icon'
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
          </a>
        // </OverlayTrigger>

      return (
        <Col xs={3} className="org-metadata">
            <p className="count">{count}</p>
            <p className="name">{name}{link !== undefined ? helpIcon() : null}</p>
        </Col>
      )
    }

    // TODO: Add appropriate links below
    return (
      <>
        <h3 className="member-results">
          {organization.name}
          <a target="_blank" rel="noreferrer" href={organization.id} style={{fontSize: '0.82em', marginLeft: '1.5em'}}>{organization.id}</a>
          <span className='inception-year'>Founded {organization.inceptionYear}</span>
        </h3>
        <div className="panel panel-transparent aggregations">
          <div className="panel-body">
            <Row>
              {stat(works[0], works[1])}
              {stat(citations[0], citations[1], 'citations-and-references')}
              {stat(views[0], views[1], 'views-and-downloads')}
              {stat(downloads[0], downloads[1], 'views-and-downloads')}
            </Row>
          </div>
        </div>
      </>
    )
  }

  const shareLink = () => {
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

  return (
    <>
      {statSummary()}
      <OrganizationMetadata metadata={organization} showTitle={false} />
      {shareLink()}
    </>
  )
}

export default Organization 
