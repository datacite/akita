import * as React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'
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
import Link from 'next/link'

type Props = {
  item: ContentItem
}

interface ContentItem {
  id: string
  doi: string
  url: string
  types: {
    resourceTypeGeneral: string
    resourceType: string
  }
  creators: Creator[]
  titles: Title[]
  publicationYear: number
  publisher: string
  descriptions: Description[]
  version: string
  citationCount: number
  viewCount: number
  downloadCount: number
}

interface Creator {
  id: string
  name: string
  givenName: string
  familyName: string
}

interface Title {
  title: string
}

interface Description {
  description: string
}

const ContentItem: React.FunctionComponent<Props> = ({item}) => {
  const title = () => {
    if (!item.titles[0]) return (
      <h3 className="work">
        <Link href="/dois/[doi]" as={`/dois/${encodeURIComponent(item.doi)}`}>
          <a>No Title</a>
        </Link>
      </h3>
    )

    const titleHtml = item.titles[0].title 

    return (
      <h3 className="work">
        <Link href="/dois/[doi]" as={`/dois/${encodeURIComponent(item.doi)}`}>
          <a>{ReactHtmlParser(titleHtml)}</a>
        </Link>
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

  return (
    <div key={item.id} className="panel panel-transparent content-item">
      <div className="panel-body">
        {title()}
        {creators()}
        {metadata()}
        {description()}
        {metricsCounter()}
      </div>
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
      <br/>
    </div>
  )
}

export default ContentItem