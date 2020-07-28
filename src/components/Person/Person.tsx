import * as React from 'react'
import { Alert, Grid, Row, Col } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import { PersonType } from '../PersonContainer/PersonContainer'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { compactNumbers } from '../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import TypesChart from '../TypesChart/TypesChart'
import ProductionChart from '../ProductionChart/ProductionChart'
import { orcidFromUrl } from "../../utils/helpers"
import Pager from '../Pager/Pager'
// import { count } from 'console'

type Props = {
  item: PersonType
}

const PersonPresentation: React.FunctionComponent<Props> = ({ item }) => {
  if (!item) return (
    <Alert bsStyle="warning">
      No content found.
    </Alert>
  )


  //// Affiliation needs work in the API
  // const afilliation = () => {
  //   return (
  //   )
  // }

  const orcid = () => {

    return (
      <div className="panel-footer">
        <a id="orcid-link" href={item.id}><FontAwesomeIcon icon={faOrcid} /> {item.id}</a>
      </div>
    )
  }

  const workCount = () => {
    if (item.works.totalCount == 0) {
      return ""
    }


    return (
      <div className="metrics-counter">
        <ul className="counter-list">
          <li>
            <h4>Works</h4>
            <Row>
              <Col xs={4}>
                <h3 id="work-count">{compactNumbers(item.works.totalCount)}</h3>
              </Col>
            </Row>
            <Row >
              {item.citationCount > 0 &&
                <Col xs={4}>
                  <h5><Pluralize singular={'Citation'} count={compactNumbers(item.citationCount)} showCount={false} /></h5>
                  <div id="citation-count">{compactNumbers(item.citationCount)}</div>
                </Col>
              }
              {item.viewCount > 0 &&
                <Col xs={4}>
                  <h5><Pluralize singular={'View'} count={compactNumbers(item.viewCount)} showCount={false} /></h5>
                  <div id="view-count">{compactNumbers(item.viewCount)}</div>
                </Col>
              }
              {item.downloadCount > 0 &&
                <Col xs={4}>
                  <h5><Pluralize singular={'Download'} count={compactNumbers(item.downloadCount)} showCount={false} /></h5>
                  <div id="download-count">{compactNumbers(item.downloadCount)}</div>
                </Col>
              }
            </Row>
          </li>
        </ul>
      </div>
    )
  }


  const analyticsBar = () => {
    if (!item.works.totalCount) return (null)

    const published = item.works.published.map(x => ({ title: x.title, count: x.count }));
    const resourceTypes = item.works.resourceTypes.map(x => ({ title: x.title, count: x.count }));

    return (
      <div>
        <h3 className="member-results">Analytics</h3>
        <div className="panel panel-transparent">
          <Grid>
            <Row>
            </Row>
            <Row>
              <Col xs={6}>
                <ProductionChart data={published} doiCount={item.works.totalCount}></ProductionChart>
              </Col>
              <Col>
                <br />
                <TypesChart data={resourceTypes} legend={false} count={item.works.totalCount}></TypesChart>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>

    )
  }

  // eslint-disable-next-line no-unused-vars
  const relatedContent = () => {
    if (!item.works.totalCount) return (
      <div className="panel panel-transparent">
        <div className="panel-body">
          <h3 className="member">Introduction</h3>
          <p>DataCite Commons is a web interface where you can explore the complete
          collection of publicly available DOIs from DOI registation agencies DataCite
          and Crossref. You can search, filter, cite results, and more!</p>
          <p>DataCite Commons is work in progress and will officially launch in October 2020.</p>
          <p><a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input to the DataCite Roadmap</a> | <a href="https://support.datacite.org/docs/datacite-search-user-documentation" target="_blank" rel="noreferrer">Information in DataCite Support</a></p>
        </div>
      </div>
    )


    const hasNextPage = item.works.pageInfo ? item.works.pageInfo.hasNextPage : false
    const endCursor = item.works.pageInfo ? item.works.pageInfo.endCursor : ""

    // const style = {
    //   fontWeight: 600,
    //   color:'#1abc9c',
    //   fontSize: '25px',
    //   padding: 0,
    //   margin: '0 0 .35em 10px',
    // }


    // const worksLabel = Pluralize({count: compactNumbers(item.works.totalCount), singular:'Work', style:style,showCount:true})


    if (!item.works.totalCount) return (
      <React.Fragment>
        <Alert bsStyle="warning">
          No content found.
        </Alert>

        <Pager url={'/person' + orcidFromUrl(item.id) + '/?'} hasNextPage={hasNextPage} endCursor={endCursor}></Pager>
      </React.Fragment>
    )

    return (
      <div>
        {item.works.totalCount > 1 &&
          <h3 className="member-results">Works</h3>
        }

        {item.works.nodes.map(item => (
          <React.Fragment key={item.id}>
            <DoiMetadata metadata={item} />
          </React.Fragment>
        ))}

        <Pager url={'/person' + orcidFromUrl(item.id) + '/?'} hasNextPage={hasNextPage} endCursor={endCursor}></Pager>
      </div>
    )
  }

  return (
    <div key={item.id} className="panel panel-transparent">
      <h2 className="member-results">{item.name}</h2>
      <div className="panel-body">
        {/* {afilliation()} */}
        {workCount()}
        {orcid()}
        <br />
      </div>
      {analyticsBar()}
      {relatedContent()}
    </div>
  )
}

export default PersonPresentation
