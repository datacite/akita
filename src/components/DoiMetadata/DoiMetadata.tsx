import * as React from 'react'
import { Popover, OverlayTrigger, Alert } from 'react-bootstrap'
import startCase from 'lodash/startCase'
import truncate from 'lodash/truncate'
import Pluralize from 'react-pluralize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faQuoteLeft, 
  faInfoCircle, 
  faExternalLinkAlt,
  faDownload,
  faBookmark
} from '@fortawesome/free-solid-svg-icons'
import { 
  faEye
} from '@fortawesome/free-regular-svg-icons'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import ReactHtmlParser from 'react-html-parser'
import Link from 'next/link'
import { useRouter } from 'next/router'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
import { compactNumbers } from '../../utils/helpers'

type Props = {
  item: DoiType
}

const DoiMetadata: React.FunctionComponent<Props> = ({item}) => {
  if (item == null) return (
    <Alert bsStyle="warning">
      No content found.
    </Alert>
  )
  
  const searchtitle = () => {
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

  const doiTitle = () => {
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

  const title = () => {
    const router = useRouter()
    if (router == null || router.pathname === '/') {
      return searchtitle()
    } else {
      return doiTitle()
    }
  }

  const creators = () => {
    if (!item.creators[0]) return (
      <div className="creators alert alert-warning">
        No creators
      </div>
    )

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

  const bookmark = (
    <Popover id="bookmark" title="Bookmarking">
      Bookmarking on this site will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const claim = (
    <Popover id="claim" title="Claim to ORCID Record">
      Claiming to an ORCID record will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const links = () => {
    return (
      <div className="panel-footer">
      <a href={item.id}><FontAwesomeIcon icon={faExternalLinkAlt}/> {item.id}</a>
      <span className="actions">
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

  return (
    <div key={item.id} className="panel panel-transparent content-item">
      <div className="panel-body">
        {title()}
        {creators()}
        {metadata()}
        {description()}
        {metricsCounter()}
      </div>
        {links()}
      <br/>
    </div>
  )
}

export default DoiMetadata
