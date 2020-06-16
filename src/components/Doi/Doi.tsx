import * as React from 'react'
import { Popover, OverlayTrigger, Tabs, Tab, Alert } from 'react-bootstrap'
import startCase from 'lodash/startCase'
import truncate from 'lodash/truncate'
import Pluralize from 'react-pluralize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faQuoteLeft, 
  faInfoCircle, 
  faShareAlt, 
  faExternalLinkAlt,
  faDownload,
  faSave,
  faBookmark
} from '@fortawesome/free-solid-svg-icons'
import { 
  faEye
} from '@fortawesome/free-regular-svg-icons'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import ReactHtmlParser from 'react-html-parser'
// import { DoiType } from './types'
// import CcLicense from './CcLicense'
import CitationFormatter from '../CitationFormatter/CitationFormatter'

type Props = {
  item: any
}

const DoiPresentation: React.FunctionComponent<Props> = ({item}) => {
  if (!item ) return (
    <Alert bsStyle="warning">
        No content found.
      </Alert>
  )
  
  const title = () => {
    if (!item.titles[0]) return (
      <h3 className="member">No Title</h3>
    )

    const titleHtml = item.titles[0].title 
    
    return (
      <h3 className="work">
        <a target="_blank" rel="noreferrer" href={item.id}>
          {ReactHtmlParser(titleHtml)}
        </a>
        {item.types.resourceTypeGeneral &&
          <span className="small"> {startCase(item.types.resourceTypeGeneral)}</span>
        }
      </h3>
    )
  }

  const creators = () => {
    if (!item.creators) return 'No creators'

    const creatorList = item.creators.reduce( (sum, creator, index, array) => {
      const c = creator.familyName ? [creator.givenName, creator.familyName].join(' ') : creator.name
      
      // padding depending on position in creators list
      if (array.length > index + 2) {
        return sum + c + ', '
      } else if (array.length > index + 1) {
        return sum + c + ' & '
      } else {
        return sum + c
      }
    }, '')

    return (
      <div className="creators">
        {creatorList}
      </div>
    )
  }

  const metadata = () => {
    return (
      <div className="metadata">
        {item.version ? 'Version ' + item.version + ' of ' : ''}{item.types.resourceType ? startCase(item.types.resourceType) : 'Content'} published {item.publicationYear} via {item.publisher}
      </div>
    )
  }

  const description = () => {
    if (!item.descriptions[0]) return ''

    const descriptionHtml = truncate(item.descriptions[0].description, { 'length': 750, 'separator': '… '})

    return (
      <div className="description">
        {ReactHtmlParser(descriptionHtml)}
      </div>
    )
  }

  const formattedCitation = () => { 
    const [selectedOption, setSelectedOption] = React.useState('')

    return (
      <div>
        <div id="citation" className="input-group pull-right">
          <select className="cite-as" onChange={e => setSelectedOption(e.target.value)} >
              <option value="apa">APA</option>
              <option value="harvard-cite-them-right">Harvard</option>
              <option value="modern-language-association">MLA</option>
              <option value="vancouver">Vancouver</option>
              <option value="chicago-fullnote-bibliography">Chicago</option>
              <option value="ieee">IEEE</option>
          </select>
        </div>
        <CitationFormatter id={item.doi} input={item.formattedCitation} locale="en" style={selectedOption}></CitationFormatter>
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
          <i><FontAwesomeIcon icon={faQuoteLeft}/> <Pluralize singular={'Citation'} count={item.citationCount} /> </i>
        }
        {item.viewCount > 0 &&
          <i><FontAwesomeIcon icon={faEye}/> <Pluralize singular={'View'} count={item.viewCount} /> </i>
        }
        {item.downloadCount > 0 &&
          <i><FontAwesomeIcon icon={faDownload}/> <Pluralize singular={'Download'} count={item.downloadCount} /> </i>
        }
      </div>
    )  
  }

  const bookmark = (
    <Popover id="bookmark" title="Bookmarking">
      Bookmarking on this site will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const share = (
    <Popover id="share" title="Sharing via Social Media">
      Sharing via social media will be implemented by August 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const save = (
    <Popover id="save" title="Download Metadata">
      Downloading metadata will be implemented by August 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const cite = (
    <Popover id="cite" title="Formatted Citation">
      Formatted citations will be implemented by August 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const claim = (
    <Popover id="claim" title="Claim to ORCID Record">
      Claiming to an ORCID record will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const links = () => {
    return (
      <div className="panel-footer">
      <a href={item.id}><FontAwesomeIcon icon={faExternalLinkAlt}/> {item.id}</a>
      <span className="actions">
        <OverlayTrigger trigger="click" placement="top" overlay={save}>
          <span className="save"><FontAwesomeIcon icon={faSave}/> Save</span>
        </OverlayTrigger>
        <OverlayTrigger trigger="click" placement="top" overlay={cite}>
          <span className="cite"><FontAwesomeIcon icon={faQuoteLeft}/> Cite</span>
        </OverlayTrigger>
        <OverlayTrigger trigger="click" placement="top" overlay={share}>
          <span className="share"><FontAwesomeIcon icon={faShareAlt}/> Share</span>
        </OverlayTrigger>
        <OverlayTrigger trigger="click" placement="top" overlay={bookmark}>
          <span className="bookmark"><FontAwesomeIcon icon={faBookmark}/> Bookmark</span>
        </OverlayTrigger>
        <OverlayTrigger trigger="click" placement="top" overlay={claim}>
          <span className="claim"><FontAwesomeIcon icon={faOrcid}/> Claim</span>
      </OverlayTrigger>
      </span>
    </div>
    )
  }

  const analyticsBar = () => {
    return (
      <div className="panel panel-transparent">
          <div className="panel-body tab-content nav-tabs-member">
        <Tabs defaultActiveKey="citationsOverTime" id="over-time-tabs">
          <Tab className="citations-over-time-tab" eventKey="citationsOverTime" title="Citations Histogram">
            {/* <CitationsChart dataInput={item.citationsOverTime} /> */}
            <p>This feature will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a></p>
          </Tab>
          <Tab className="views-over-time-tab" eventKey="viewsOverTime" title="Views Histogram">
            {/* <ViewsChart dataInput={item.viewsOverTime} /> */}
            <p>This feature will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a></p>
          </Tab>
          <Tab className="downloads-over-time-tab" eventKey="downloadsOverTime" title="Downloads Histogram">
            {/* <DownloadsChart dataInput={item.downloadsOverTime} /> */}
            <p>This feature will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a></p>
          </Tab>
        </Tabs>
        </div>
      </div>
    )
  }

  const relatedContent = () => {
    return (
      <div className="panel panel-transparent">
      <div className="panel-body tab-content nav-tabs-member">
    <Tabs defaultActiveKey="citationsList" id="related-content-tabs">
      <Tab className="citations-list" eventKey="citationsList" title="Citations">
        {/* <RelatedContentList dataInput={item.citations} /> */}
        <p>This feature will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a></p>

      </Tab>
      <Tab className="references-list" eventKey="referencesList" title="References">
        {/* <RelatedContentList dataInput={item.references} /> */}
        <p>This feature will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a></p>

      </Tab>
    </Tabs>
    </div>
  </div>
    )
  }

  return (
    <div key={item.id} className="panel panel-transparent">
      <h3 className="member-results">{item.doi}</h3>
      <div className="panel-body">
        {title()}
        {creators()}
        {metadata()}
        {description()}
        {metricsCounter()}
      </div>
      {links()}
      <br/>

      {formattedCitation()}

      {analyticsBar()}
      {relatedContent()}
    </div>
  )
}

export default DoiPresentation
