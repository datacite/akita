import React from 'react'
import { Alert } from 'react-bootstrap'
import { useFeature } from 'flagged'

import { WorkType } from '../WorkContainer/WorkContainer'
import PersonMetadata from '../PersonMetadata/PersonMetadata'
import PersonEmployment from '../PersonEmployment/PersonEmployment'
// import { compactNumbers } from '../../utils/helpers'
// import Pluralize from 'react-pluralize'

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
  if (!person) return <Alert bsStyle="warning">No person found.</Alert>

  const showEmployment = person.employment.length > 0 && useFeature('personEmployment')

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
