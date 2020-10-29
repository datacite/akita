import React from 'react'
import { Alert, Row, Col } from 'react-bootstrap'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

import { WorkType } from '../../pages/doi.org/[...doi]'
import PersonMetadata from '../PersonMetadata/PersonMetadata'
import PersonEmployment from '../PersonEmployment/PersonEmployment'
import { pluralize, orcidFromUrl } from '../../utils/helpers'

export interface PersonRecord {
  id: string
  description: string
  links: Link[]
  identifiers: Identifier[]
  alternateName?: string[]
  country: Attribute
  employment: EmploymentRecord[]
  name: string
  givenName: string
  familyName: string
  citationCount: number
  viewCount: number
  downloadCount: number
  works: Works
}

export interface Attribute {
  name: string
  id: string
}

export interface EmploymentRecord {
  organizationId: string
  organizationName: string
  roleTitle: string
  startDate: Date
  endDate: Date
}

interface Works {
  totalCount: number
  resourceTypes: ContentFacet[]
  pageInfo: PageInfo
  published: ContentFacet[]
  licenses: ContentFacet[]
  languages: ContentFacet[]
  nodes: WorkType[]
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface Identifier {
  identifier: string
  identifierType: string
  identifierUrl: string
}

interface Link {
  url: string
  name: string
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

type Props = {
  person: PersonRecord
}

const Person: React.FunctionComponent<Props> = ({ person }) => {
  if (!person) return <Alert bsStyle="warning">No person found.</Alert>

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/orcid.org' + orcidFromUrl(person.id)
      : 'https://commons.stage.datacite.org/orcid.org' + orcidFromUrl(person.id)

  const title = person.name
    ? 'DataCite Commons: ' + person.name
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
    if (person.citationCount + person.viewCount + person.downloadCount === 0) {
      return <div></div>
    }

    return (
      <>
        <h3 className="member-results">Aggregated Citations, Views and Downloads</h3>
        <div className="panel panel-transparent aggregations">
          <div className="panel-body">
            <Row>
              {person.citationCount > 0 && (
                <Col xs={4} className="text-center">
                <h4 className="work">{pluralize(person.citationCount, 'Citation', true)}</h4>
                </Col>
              )}
              {person.viewCount > 0 && (
                <Col xs={4} className="text-center">
                  <h4 className="work">{pluralize(person.viewCount, 'View', true)}</h4>
                </Col>
              )}
              {person.downloadCount > 0 && (
                <Col xs={4} className="text-center">
                <h4 className="work">{pluralize(person.downloadCount, 'Download', true)}</h4>
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
      <h3 className="member-results">{person.id}</h3>
      <PersonMetadata metadata={person} />
      {shareLink()}
      <h3 className="member-results" id="person-employment">Employment</h3>
      {person.employment.map((item) => (
        <div className="panel panel-transparent employment" key={item.organizationName}>
          <PersonEmployment employment={item} />
        </div>
      ))}
      {workCount()}
    </>
  )
}

export default Person
