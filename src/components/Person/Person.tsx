import * as React from 'react'
import { Alert, Grid, Row, Col } from 'react-bootstrap'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
import DoiRelatedContent from '../DoiRelatedContent/DoiRelatedContent'
import TypesChart from '../TypesChart/TypesChart'
import ProductionChart from '../ProductionChart/ProductionChart'
import { orcidFromUrl } from '../../utils/helpers'
import Pager from '../Pager/Pager'

export interface PersonRecord {
  id: string
  name: string
  givenName: string
  familyName: string
  citationCount: number
  viewCount: number
  downloadCount: number
  affiliation: Attribute[]
  works: Works
}

interface Works {
  totalCount: number
  resourceTypes: ContentFacet[]
  pageInfo: PageInfo
  published: ContentFacet[]
  nodes: DoiType[]
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface ContentFacet {
  id: string
  title: string
  count: number
}

export interface Attribute {
  name: string
  id: string
}

type Props = {
  person: PersonRecord
}

const Person: React.FunctionComponent<Props> = ({ person }) => {
  if (!person) return <Alert bsStyle="warning">No person found.</Alert>

  //// Affiliation needs work in the API
  const afilliation = () => {
    if (person.affiliation.length < 1) {
      return null
    }
    return (
      <div className="metrics-counter">
        <span>
          From &nbsp;
          <a id="affiliation" href={person.affiliation[0].id}>
            {person.affiliation[0].name}
          </a>
        </span>
      </div>
    )
  }

  const name = () => {
    return (
      <React.Fragment>
        <h3 className="work">
          <a id="orcid-link" href={person.id}>{person.name}</a>
        </h3>
        <br/>
      </React.Fragment>
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
  //           <h4>Works</h4>
  //           <Row>
  //             <Col xs={4}>
  //               <h3 id="work-count">
  //                 {compactNumbers(person.works.totalCount)}
  //               </h3>
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

  const analyticsBar = () => {
    if (!person.works.totalCount) return null

    const published = person.works.published.map((x) => ({
      title: x.title,
      count: x.count
    }))
    const resourceTypes = person.works.resourceTypes.map((x) => ({
      title: x.title,
      count: x.count
    }))

    return (
      <React.Fragment>
        <h3 className="member-results">Analytics</h3>
        <Row>
          <Col xs={8}>
            <ProductionChart
              data={published}
              doiCount={person.works.totalCount}
            ></ProductionChart>
          </Col>
          <Col xs={4}>
            <TypesChart
              data={resourceTypes}
              legend={false}
              count={person.works.totalCount}
            ></TypesChart>
          </Col>
        </Row>
      </React.Fragment>
    )
  }

  // eslint-disable-next-line no-unused-vars
  const relatedContent = () => {
    const hasNextPage = person.works.pageInfo
      ? person.works.pageInfo.hasNextPage
      : false
    const endCursor = person.works.pageInfo
      ? person.works.pageInfo.endCursor
      : ''

    if (!person.works.totalCount)
      return (
        <Alert bsStyle="warning">No works found.</Alert>
      )

    return (
      <React.Fragment>
        {person.works.totalCount > 1 && (
          <h3 className="member-results">Works</h3>
        )}

        <DoiRelatedContent dois={person.works} />

        {person.works.totalCount > 25 && (
          <Pager
            url={'/people' + orcidFromUrl(person.id) + '/?'}
            hasNextPage={hasNextPage}
            endCursor={endCursor}
            isNested={true}
          ></Pager>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <h3 className="member-results">{person.id}</h3>
      <div className="panel panel-transparent">
        <div className="panel-body">
          {name()}
          {afilliation()}
        </div>
      </div>
      {analyticsBar()}
      {relatedContent()}
    </React.Fragment>
  )
}

export default Person
