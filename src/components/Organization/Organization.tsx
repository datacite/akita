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
import { rorFromUrl } from '../../utils/helpers'
import { Works } from '../SearchWork/SearchWork'
import { MetricsDisplay } from '../MetricsDisplay/MetricsDisplay'

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
      <h3 className="member-results" style={{ borderWidth: 0 }}>
        {organization.name}
        <a target="_blank" rel="noreferrer" href={organization.id} style={{fontSize: '0.82em', marginLeft: '1.5em'}}>{organization.id}</a>
        {organization.inceptionYear && <span className='inception-year'>Founded {organization.inceptionYear}</span>}
      </h3>
      <div className="panel panel-transparent aggregations">
        <div className="panel-body">
          <MetricsDisplay
            counts={{ works: organization.works.totalCount, citations: organization.citationCount, views: organization.viewCount, downloads: organization.downloadCount }}
            links={{
              citations: 'https://support.datacite.org/docs/citations-and-references',
              views: 'https://support.datacite.org/docs/views-and-downloads',
              downloads: 'https://support.datacite.org/docs/views-and-downloads'
            }}
          />
        </div>
      </div>
      <OrganizationMetadata metadata={organization} showTitle={false} />
      {shareLink()}
    </>
  )
}

export default Organization 
