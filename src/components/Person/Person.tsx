import React from 'react'
import Image from 'next/image'
import heroImage from '../../../public/images/hero.svg'
import unlockImage from '../../../public/images/unlock.svg'
import scienceImage from '../../../public/images/science.svg'
import { Alert, Row, Col } from 'react-bootstrap'

import { Work } from 'src/data/types'
import PersonMetadata from '../PersonMetadata/PersonMetadata'
import PersonEmployment from '../PersonEmployment/PersonEmployment'
import { pluralize } from '../../utils/helpers'

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
  totalWorks: Works
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
  totalContentUrl: number
  totalOpenLicenses: number
  openLicenseResourceTypes: ContentFacet[]
  resourceTypes: ContentFacet[]
  pageInfo: PageInfo
  published: ContentFacet[]
  licenses: ContentFacet[]
  languages: ContentFacet[]
  nodes: Work[]
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

  let has_open_access_software = false;
  let has_open_access_paper = false;
  let has_open_access_dataset = false;
  person.totalWorks.openLicenseResourceTypes.forEach(
    (v) => {
      if (v.id == "software" && v.count > 0) {
        has_open_access_software = true
      }

      if (v.id == "dataset" && v.count > 0) {
        has_open_access_dataset = true
      }

      if ((v.id == "text" || v.id == "journalarticle") && v.count > 0) {
        has_open_access_paper = true
      }
    }
  )

  const open_license_count = person.totalWorks.totalOpenLicenses

  const is_open_hero = open_license_count == person.totalWorks.totalCount && person.totalWorks.totalCount > 0
  const is_open_license = open_license_count > 0
  const is_os_triathlete = has_open_access_software && has_open_access_paper && has_open_access_dataset
  const is_open_access = person.totalWorks.totalContentUrl > 0

  const percentage_open_license = Math.round((open_license_count / person.totalWorks.totalCount) * 100)
  const percentage_open_url = Math.round((person.totalWorks.totalContentUrl / person.totalWorks.totalCount) * 100)

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
                <h4 className="work">{pluralize(person.citationCount, 'Citation')}</h4>
                </Col>
              )}
              {person.viewCount > 0 && (
                <Col xs={4} className="text-center">
                  <h4 className="work">{pluralize(person.viewCount, 'View')}</h4>
                </Col>
              )}
              {person.downloadCount > 0 && (
                <Col xs={4} className="text-center">
                <h4 className="work">{pluralize(person.downloadCount, 'Download')}</h4>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </>
    )
  }

  const accessAchievements = () => {
    if (!is_open_hero && !is_open_license && !is_open_access && !is_os_triathlete) {
      return <div></div>
    }

    return (
      <>
        <h3 className="member-results">Accessibility Achievements</h3>
        <div className="panel panel-transparent achievements">
          <div className="panel-body">
            {is_open_hero &&
              <Row className="align-items-center">
                <Col xs={1}>
                  <Image
                    src={heroImage}
                    width="74"
                    height="74"
                    title="Superhero by tulpahn from the Noun Project"
                    alt="Superhero by tulpahn from the Noun Project"
                  />
                </Col>
                <Col>
                  Every single one of your publications is free to access online. Open access helps real people, and that&apos;s pretty heroic.
                </Col>
              </Row>
            }
            {is_open_license &&
              <Row>
                <Col xs={1}>
                  <Image
                    src={heroImage}
                    width="74"
                    height="74"
                    title="Superhero by tulpahn from the Noun Project"
                    alt="Superhero by tulpahn from the Noun Project"
                  />
                </Col>
                <Col>
                  {percentage_open_license}% of the researcher&apos;s associated DOIs have metadata with rights as CC-BY, CC0 or public domain license.
                </Col>
              </Row>
            }
            {is_os_triathlete &&
              <Row >
                <Col xs={1}>
                  <Image
                    src={scienceImage}
                    width="74"
                    height="74"
                    title="science education by Vectors Market from the Noun Project"
                    alt="science education by Vectors Market from the Noun Project"
                  />
                </Col>
                <Col>
                  Congratulations, you hit the trifecta. You have an open access paper, open dataset, and open source software.
                </Col>
              </Row>
            }
            {is_open_access &&
              <Row className="mb-1">
                <Col xs={1}>
                <Image
                  src={unlockImage}
                  width="74"
                  height="74"
                  title="unlock by Alexandr Cherkinsky from the Noun Project"
                  alt="unlock by Alexandr Cherkinsky from the Noun Project"
                />
                </Col>
                <Col>
                  {percentage_open_url}% of your research is free to read online.
                </Col>
              </Row>
            }
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* <h3 className="member-results">{person.id}</h3> */}
      <PersonMetadata metadata={person} />
      {person.employment.length > 0 && (
        <h3 className="member-results" id="person-employment">Employment</h3>
      )}
      {person.employment.map((item) => (
        <div className="panel panel-transparent employment" key={item.organizationName}>
          <PersonEmployment employment={item} />
        </div>
      ))}
      {workCount()}

      {accessAchievements()}
    </>
  )
}

export default Person
