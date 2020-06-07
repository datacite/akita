import * as React from 'react'
import { Modal, Popover, OverlayTrigger } from 'react-bootstrap'
import startCase from 'lodash/startCase'
import truncate from 'lodash/truncate'
import Pluralize from 'react-pluralize'
import ReactHtmlParser from 'react-html-parser'

type Props = {
  item: ContentItem;
};

interface ContentItem {
  id: string;
  doi: string;
  url: string;
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
      <h3 className="member">No Title</h3>
    )

    const titleHtml = item.titles[0].title 
    
    return (
      <h3 className="member">
        {ReactHtmlParser(titleHtml)}
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
          <i className="fa fa-info-circle"></i> <i>No citations, views or downloads reported.</i>
        </div>
      )
    }

    return (
      <div className="metrics-counter">
        {item.citationCount > 0 &&
          <i><i className="fa fa-quote-right"></i> <Pluralize singular={'Citation'} count={item.citationCount} /> </i>
        }
        {item.viewCount > 0 &&
          <i><i className="fa fa-eye"></i> <Pluralize singular={'View'} count={item.viewCount} /> </i>
        }
        {item.downloadCount > 0 &&
          <i><i className="fa fa-download"></i> <Pluralize singular={'Download'} count={item.downloadCount} /> </i>
        }
      </div>
    )  
  }

  const bookmark = (
    <Popover id="bookmark" title="Bookmarking">
      Bookmarking on this site will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank">Provide input</a>
    </Popover>
  )

  const share = (
    <Popover id="share" title="Sharing via Social Media">
      Sharing via social media platforms will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank">Provide input</a>
    </Popover>
  )

  const cite = (
    <Popover id="cite" title="Formatted Citation">
      Formatted citations will be implemented by August 2020. <a href="https://datacite.org/roadmap.html" target="_blank">Provide input</a>
    </Popover>
  )

  const claim = (
    <Popover id="claim" title="Claim to ORCID Record">
      Claiming to your ORCID record will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank">Provide input</a>
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
        <a href={item.id}><i className='fa fa-external-link'></i> {item.id}</a>
        <span className="actions">
          <OverlayTrigger trigger="click" placement="top" overlay={bookmark}>
            <span className="bookmark"><i className='fa fa-bookmark'></i> Bookmark</span>
          </OverlayTrigger>
          <OverlayTrigger trigger="click" placement="top" overlay={share}>
            <span className="share"><i className='fa fa-share-alt'></i> Share</span>
          </OverlayTrigger>
          <OverlayTrigger trigger="click" placement="top" overlay={cite}>
            <span className="cite"><i className='fa fa-quote-left'></i> Cite</span>
          </OverlayTrigger>
          <OverlayTrigger trigger="click" placement="top" overlay={claim}>
            <span className="claim"><img src="https://assets.datacite.org/images/orcid_16x16.gif" /> Claim</span>
        </OverlayTrigger>
        </span>
      </div>
      <br/>
    </div>
  )
}

export default ContentItem
