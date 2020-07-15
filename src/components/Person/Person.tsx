import * as React from 'react'
import { Alert, Grid, Row, Col, Pager } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import { PersonType } from '../PersonContainer/PersonContainer'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { compactNumbers } from '../../utils/helpers'
import ReactHtmlParser from 'react-html-parser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faQuoteLeft, 
  faInfoCircle, 
  faExternalLinkAlt,
  faEye,
  faDownload,
  faBookmark,
  faScroll
} from '@fortawesome/free-solid-svg-icons'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import TypesChart from '../TypesChart/TypesChart'
import ProductionChart from '../ProductionChart/ProductionChart'
import { useRouter } from 'next/router'

type Props = {
  item: PersonType
}

const PersonPresentation: React.FunctionComponent<Props> = ({item}) => {
  if (!item ) return (
    <Alert bsStyle="warning">
        No content found.
      </Alert>
  )



  // const afilliation = () => {
  //   if (!item.afilliation[0]) return (
  //     <h3 className="work">
  //       <Link href="/dois/[doi]" as={`/dois/${encodeURIComponent(item.doi)}`}>
  //         <a>No Title</a>
  //       </Link>
  //     </h3>
  //   )

  //   const titleHtml = item.titles[0].title 

  //   return (
  //     <h3 className="work">
  //       <Link href="/dois/[doi]" as={`/dois/${encodeURIComponent(item.doi)}`}>
  //         <a>{ReactHtmlParser(titleHtml)}</a>
  //       </Link>
  //       {item.types.resourceTypeGeneral &&
  //         <span className="small"> {startCase(item.types.resourceTypeGeneral)}</span>
  //       }
  //     </h3>
  //   )
  // }

  const orcid = () => {

    return (
      <div className="metrics-counter">
        <a id="orcid-link" href={item.id}><FontAwesomeIcon icon={faOrcid}/> {item.id}</a>
      </div>
    )
  }

  const workCount = () => {
    if (item.works.totalCount == 0) {
      return ""
    }


    return (
      <div className="metrics-counter">

      <i id="work-count"><FontAwesomeIcon  icon={faScroll}/> <Pluralize singular={'Work'} count={compactNumbers(item.works.totalCount)} /> </i>
      </div>
    )
  }


  const metricsCounter = () => {
    if (item.citationCount + item.viewCount + item.downloadCount == 0) {
      return (
        <div className="metrics-counter">
          <i><FontAwesomeIcon icon={faInfoCircle}/> No citations, views or downloads reported.</i>
        </div>
      )
    }

    return (
      <div className="metrics-counter">
        {item.citationCount > 0 &&
          <i><FontAwesomeIcon icon={faQuoteLeft}/> <Pluralize singular={'Citation'} count={compactNumbers(item.citationCount)} /> </i>
        }
        {item.viewCount > 0 &&
          <i><FontAwesomeIcon icon={faEye}/> <Pluralize singular={'View'} count={compactNumbers(item.viewCount)} /> </i>
        }
        {item.downloadCount > 0 &&
          <i><FontAwesomeIcon icon={faDownload}/> <Pluralize singular={'Download'} count={compactNumbers(item.downloadCount)} /> </i>
        }
      </div>
    )  
  }

  const renderPagination = () => {
    const orcid = document.createElement('a');
    orcid.href = item.id;

    let url = 'person' + orcid.pathname + '/?'
    let firstPageUrl = null
    let hasFirstPage = false
    let nextPageUrl = null
    let hasNextPage = false

    // get current query parameters from next router
    const router = useRouter()
    let params = new URLSearchParams(router.query as any)

    if (params.get('cursor')) {
      // remove cursor query parameter for first page
      params.delete('cursor')
      firstPageUrl = url + params.toString()
      hasFirstPage = typeof(firstPageUrl) === 'string'
    }

    if (item.works.pageInfo.hasNextPage && item.works.pageInfo.endCursor) {
      // set cursor query parameter for next page
      params.set('cursor', item.works.pageInfo.endCursor)
      nextPageUrl = url + params.toString()
      console.log(nextPageUrl);
      hasNextPage = typeof(nextPageUrl) === 'string'
    }

    return (
      <Pager>
        <Pager.Item disabled={!hasFirstPage} href={firstPageUrl}>First Page</Pager.Item>
        <Pager.Item disabled={!hasNextPage} href={nextPageUrl}>Next Page</Pager.Item>
      </Pager>
    )
  }
  

  const analyticsBar = () => {
    if (!item.works.totalCount ) return (null)

    return (
      <div>
        <h3 className="member-results">Analytics</h3>
        <div className="panel panel-transparent">
          <Grid>
            <Row>
            </Row>
            <Row>
              <Col xs={6}>
              <ProductionChart data={item.works.published} doiCount={item.works.totalCount}></ProductionChart>
              </Col>
              <Col>
              <br/>
              <TypesChart data={item.works.resourceTypes} legend={true} count={item.works.totalCount}></TypesChart>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>

    )
  }

// eslint-disable-next-line no-unused-vars
  const relatedContent = () => {
    if (!item.works.totalCount ) return (
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

    const style = {
      fontWeight: 600,  
      color:'#1abc9c',
      fontSize: '25px',
      padding: 0,
      margin: '0 0 .35em 10px',
    }


    const worksLabel = Pluralize({count: compactNumbers(item.works.totalCount), singular:'Work', style:style,showCount:true}) 


    if (!item.works.totalCount) return (
      <React.Fragment>
        <Alert bsStyle="warning">
          No content found.
        </Alert>

        {/* {renderPagination()} */}
      </React.Fragment>
    )

    return (
      <div>
        {item.works.totalCount > 1 &&
         <h3 className="member-results"></h3>
        }

        {item.works.nodes.map(item => (
          <React.Fragment key={item.id}>
            <DoiMetadata item={item} />
          </React.Fragment>
        ))}

        {renderPagination()}
      </div>
    )


  


    return (
      <div>
        <h3 className="member-results">{worksLabel}</h3>
        <div className="panel panel-transparent">
          <div className="formatted-citation panel-body">
            {item.works.nodes.length > 0 &&
            <div className="works-list">
              {/*
              <RelatedContentList dataInput={item.works} /> */}
              <p>This feature will be implemented later in 2020. <a
                  href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank"
                  rel="noreferrer">Provide input</a></p>

            </div>
            }
          </div>
        </div>
      </div>
     )
   }

  return (
    <div key={item.id} className="panel panel-transparent">
      <h2 className="member-results">{item.name}</h2>
      <div className="panel-body">
      {/* {name()} */}
      {/* {afilliation()} */}
      {workCount()}
      {metricsCounter()}
      {orcid()}
      <br/>
      </div>
      {analyticsBar()}
      {relatedContent()}
      </div>
  )
}

export default PersonPresentation
