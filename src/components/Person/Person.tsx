import React from 'react'
import { Alert, Row, Col } from 'react-bootstrap'
import { useFeature } from 'flagged'
import QRCode from 'react-qr-code'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'

import { WorkType } from '../WorkContainer/WorkContainer'
import PersonMetadata from '../PersonMetadata/PersonMetadata'
import PersonEmployment from '../PersonEmployment/PersonEmployment'
import { orcidFromUrl } from '../../utils/helpers'

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
  const showQrCode = useFeature('downloadLink')
  const personEmployment = useFeature('personEmployment')
  const showEmployment = person.employment.length > 0 && personEmployment

  if (!person) return <Alert bsStyle="warning">No person found.</Alert>

  const shareLink = () => {
    const pageUrl =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
        ? 'https://commons.datacite.org/orcid.org' + orcidFromUrl(person.id)
        : 'https://commons.stage.datacite.org/orcid.org' + orcidFromUrl(person.id)

    const title = person.name
      ? 'DataCite Commons: ' + person.name
      : 'DataCite Commons: No Name'

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
              {showQrCode && (
                <Col xs={6} md={4}>
                  <QRCode
                    value={'https://commons.datacite.org/orcid.org' + orcidFromUrl(person.id)}
                    size={100}
                  />
                </Col>
              )}
            </Row>
          </div>
        </div>
      </>
    )
  }

  // const workCount = () => {
  //   if (person.works.totalCount == 0) {
  //     return ''
  //   }

  //   return (
  //     <div className="metrics-counter">
  //       <ul className="counter-list">
  //         <li>
  //           {/* <h4>Works</h4> */}
  //           <Row>
  //             <Col xs={4}>
  //               {/* <h3 id="work-count"> */}
  //               {/* {compactNumbers(person.works.totalCount)} */}
  //               {/* </h3> */}
  //             </Col>
  //           </Row>
  //           <Row>
  //             {person.citationCount > 0 && (
  //               <Col xs={4}>
  //                 <h5>
  //                   <Pluralize
  //                     singular={'Citation'}
  //                     count={compactNumbers(person.citationCount)}
  //                     showCount={false}
  //                   />
  //                 </h5>
  //                 <div id="citation-count">
  //                   {compactNumbers(person.citationCount)}
  //                 </div>
  //               </Col>
  //             )}
  //             {person.viewCount > 0 && (
  //               <Col xs={4}>
  //                 <h5>
  //                   <Pluralize
  //                     singular={'View'}
  //                     count={compactNumbers(person.viewCount)}
  //                     showCount={false}
  //                   />
  //                 </h5>
  //                 <div id="view-count">{compactNumbers(person.viewCount)}</div>
  //               </Col>
  //             )}
  //             {person.downloadCount > 0 && (
  //               <Col xs={4}>
  //                 <h5>
  //                   <Pluralize
  //                     singular={'Download'}
  //                     count={compactNumbers(person.downloadCount)}
  //                     showCount={false}
  //                   />
  //                 </h5>
  //                 <div id="download-count">
  //                   {compactNumbers(person.downloadCount)}
  //                 </div>
  //               </Col>
  //             )}
  //           </Row>
  //         </li>
  //       </ul>
  //     </div>
  //   )
  // }

  return (
    <>
      <h3 className="member-results">{person.id}</h3>
      <PersonMetadata metadata={person} />
      {shareLink()}
      {showEmployment && (
        <h3 className="member-results" id="person-employment">Employment</h3>
      )}
      {showEmployment && (
        person.employment.map((item) => (
          <div className="panel panel-transparent employment" key={item.organizationName}>
            <PersonEmployment employment={item} />
          </div>
        )
      ))}
    </>
  )
}

export default Person
