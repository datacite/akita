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

  const workCount = () => {
    if (
      organization.citationCount + organization.viewCount + organization.downloadCount ==
      0
    ) {
      return <div></div>
    }

    return (
      <>
        <h3 className="member-results">Aggregated Citations, Views and Downloads</h3>
        <div className="panel panel-transparent aggregations">
          <div className="panel-body">
            <Row>
              {organization.citationCount > 0 && (
                <Col xs={4} className="text-center">
                <h4 className="work">{pluralize(organization.citationCount, 'Citation')}</h4>
                </Col>
              )}
              {organization.viewCount > 0 && (
                <Col xs={4} className="text-center">
                  <h4 className="work">{pluralize(organization.viewCount, 'View')}</h4>
                </Col>
              )}
              {organization.downloadCount > 0 && (
                <Col xs={4} className="text-center">
                <h4 className="work">{pluralize(organization.downloadCount, 'Download')}</h4>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <h3 className="member-results">{organization.id}</h3>
      <OrganizationMetadata metadata={organization} />
      {shareLink()}
      {workCount()}
    </>
  )
}

export default Organization 
