import * as React from 'react'
import { Alert, Row, Col } from 'react-bootstrap'
import { DoiType } from '../WorkContainer/WorkContainer'
import TypesChart from '../TypesChart/TypesChart'
import LicenseChart from '../LicenseChart/LicenseChart'
import PersonMetadata from '../PersonMetadata/PersonMetadata'
import ProductionChart from '../ProductionChart/ProductionChart'
import Pager from '../Pager/Pager'
import { orcidFromUrl, compactNumbers } from '../../utils/helpers'
import Pluralize from 'react-pluralize'
import clone from 'lodash/clone'

export interface PersonRecord {
  id: string
  description: string
  links: Link[]
  identifiers: Identifier[]
  alternateName?: string[]
  country: Attribute
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

interface Works {
  totalCount: number
  resourceTypes: ContentFacet[]
  pageInfo: PageInfo
  published: ContentFacet[]
  licenses: ContentFacet[]
  languages: ContentFacet[]
  nodes: DoiType[]
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

  const workCount = () => {
    if (person.works.totalCount == 0) {
      return ''
    }

    return (
      <div className="metrics-counter">
        <ul className="counter-list">
          <li>
            {/* <h4>Works</h4> */}
            <Row>
              <Col xs={4}>
                {/* <h3 id="work-count"> */}
                {/* {compactNumbers(person.works.totalCount)} */}
                {/* </h3> */}
              </Col>
            </Row>
            <Row>
              {person.citationCount > 0 && (
                <Col xs={4}>
                  <h5>
                    <Pluralize
                      singular={'Citation'}
                      count={compactNumbers(person.citationCount)}
                      showCount={false}
                    />
                  </h5>
                  <div id="citation-count">
                    {compactNumbers(person.citationCount)}
                  </div>
                </Col>
              )}
              {person.viewCount > 0 && (
                <Col xs={4}>
                  <h5>
                    <Pluralize
                      singular={'View'}
                      count={compactNumbers(person.viewCount)}
                      showCount={false}
                    />
                  </h5>
                  <div id="view-count">{compactNumbers(person.viewCount)}</div>
                </Col>
              )}
              {person.downloadCount > 0 && (
                <Col xs={4}>
                  <h5>
                    <Pluralize
                      singular={'Download'}
                      count={compactNumbers(person.downloadCount)}
                      showCount={false}
                    />
                  </h5>
                  <div id="download-count">
                    {compactNumbers(person.downloadCount)}
                  </div>
                </Col>
              )}
            </Row>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <React.Fragment>
      <h3 className="member-results">{person.id}</h3>
      <PersonMetadata metadata={person} />
      {workCount()}
    </React.Fragment>
  )
}

export default Person
