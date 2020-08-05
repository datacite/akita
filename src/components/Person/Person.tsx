import * as React from 'react'
import { Alert, Grid, Row, Col } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
import DoiRelatedContent from '../DoiRelatedContent/DoiRelatedContent'
import { compactNumbers } from '../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import TypesChart from '../TypesChart/TypesChart'
import ProductionChart from '../ProductionChart/ProductionChart'
import { orcidFromUrl } from "../../utils/helpers"
import Pager from '../Pager/Pager'
// import { count } from 'console'

export interface PersonRecord {
  id: string
  name: string
  givenName: string
  familyName: string
  citationCount: number
  viewCount: number
  pageInfo: PageInfo
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
  if (!person) return (
    <Alert bsStyle="warning">
      No content found.
    </Alert>
  )

  //// Affiliation needs work in the API
  const afilliation = () => {
    if (person.affiliation.length < 1) { return null }
    return (
      <div className="metrics-counter">
      <span>From &nbsp; 
      <a id="affiliation" href={person.affiliation[0].id}>{person.affiliation[0].name}</a>
      </span> 
     </div>
    )
  }

  const orcid = () => {
    return (
      <div className="panel-footer">
        <a id="orcid-link" href={person.id}><FontAwesomeIcon icon={faOrcid} /> {person.id}</a>
      </div>
    )
  }

  const workCount = () => {
    if (person.works.totalCount == 0) {
      return ""
    }

    return (
      <div className="metrics-counter">
        <ul className="counter-list">
          <li>
            <h4>Works</h4>
            <Row>
              <Col xs={4}>
                <h3 id="work-count">{compactNumbers(person.works.totalCount)}</h3>
              </Col>
            </Row>
            <Row >
              {person.citationCount > 0 &&
                <Col xs={4}>
                  <h5><Pluralize singular={'Citation'} count={compactNumbers(person.citationCount)} showCount={false} /></h5>
                  <div id="citation-count">{compactNumbers(person.citationCount)}</div>
                </Col>
              }
              {person.viewCount > 0 &&
                <Col xs={4}>
                  <h5><Pluralize singular={'View'} count={compactNumbers(person.viewCount)} showCount={false} /></h5>
                  <div id="view-count">{compactNumbers(person.viewCount)}</div>
                </Col>
              }
              {person.downloadCount > 0 &&
                <Col xs={4}>
                  <h5><Pluralize singular={'Download'} count={compactNumbers(person.downloadCount)} showCount={false} /></h5>
                  <div id="download-count">{compactNumbers(person.downloadCount)}</div>
                </Col>
              }
            </Row>
          </li>
        </ul>
      </div>
    )
  }

  const analyticsBar = () => {
    if (!person.works.totalCount) return (null)

    const published = person.works.published.map(x => ({ title: x.title, count: x.count }));
    const resourceTypes = person.works.resourceTypes.map(x => ({ title: x.title, count: x.count }));

    return (
      <div>
        <h3 className="member-results">Analytics</h3>
        <div className="panel panel-transparent">
          <Grid>
            <Row>
            </Row>
            <Row>
              <Col xs={6}>
                <ProductionChart data={published} doiCount={person.works.totalCount}></ProductionChart>
              </Col>
              <Col>
                <br />
                <TypesChart data={resourceTypes} legend={false} count={person.works.totalCount}></TypesChart>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    )
  }

  // eslint-disable-next-line no-unused-vars
  const relatedContent = () => {
    if (!person.works.totalCount) return (
      <div className="panel panel-transparent">
        <div className="panel-body">
          <h3 className="member">Introduction</h3>
          <p>DataCite Commons is a web search interface for the <a href="https://doi.org/10.5438/jwvf-8a66" target="_blank" rel="noreferrer">PID Graph</a>, 
          the graph formed by the collection of scholarly resources such as
          publications, datasets, people and research organizations, and their connections. The PID Graph
          uses persistent identifiers and <a href="https://graphql.org/" target="_blank" rel="noreferrer">GraphQL</a>, 
          with PIDs and metadata provided by DataCite, Crossref, ORCID, and others.</p> 
          <p>DataCite Commons is work in progress and will officially launch in October 2020. The work is
          supported by funding from the European Union’s Horizon 2020 research and innovation programme.</p>
          <p><a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input to the DataCite Roadmap</a> | <a href="https://support.datacite.org/docs/datacite-search-user-documentation" target="_blank" rel="noreferrer">Information in DataCite Support</a></p>
        </div>
      </div>
    )

    const hasNextPage = person.works.pageInfo ? person.works.pageInfo.hasNextPage : false
    const endCursor = person.works.pageInfo ? person.works.pageInfo.endCursor : ""

    if (!person.works.totalCount) return (
      <React.Fragment>
        <Alert bsStyle="warning">
          No content found.
        </Alert>

        <Pager url={'/people' + orcidFromUrl(person.id) + '/?'} hasNextPage={hasNextPage} endCursor={endCursor} isNested={true}></Pager>
      </React.Fragment>
    )

    return (
      <div>
        {person.works.totalCount > 1 &&
          <h3 className="member-results">Works</h3>
        }

        <DoiRelatedContent dois={person.works} />


        <Pager url={'/people' + orcidFromUrl(person.id) + '/?'} hasNextPage={hasNextPage} endCursor={endCursor} isNested={true}></Pager>
      </div>
    )
  }

  return (
    <div key={person.id} className="panel panel-transparent">
      <h2 className="member-results">{person.name}</h2>
      <div className="panel-body">
        {afilliation()}
        {workCount()}
        {orcid()}
        <br />
      </div>
      {analyticsBar()}
      {relatedContent()}
    </div>
  )
}

export default Person
