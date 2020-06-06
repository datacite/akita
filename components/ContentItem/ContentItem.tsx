import * as React from 'react'
import _ from 'lodash'
import Pluralize from 'react-pluralize'

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

    return (
      <h3 className="member">
        {item.titles[0].title} {item.types.resourceTypeGeneral &&
          <span className="small">{item.types.resourceTypeGeneral}</span>
        }
      </h3>
    )
  }

  const creators = () => {
    if (!item.creators) return 'No creators'

    return (
      <React.Fragment>
        {item.creators.map((creator) =>
          creator.familyName ? [creator.givenName, creator.familyName].join(' ') : creator.name
         ).join(', ')}
      </React.Fragment>
    )
  }

  const metadata = () => {
    return (
      <div className="metadata">
        {item.version ? 'Version ' + item.version + ' of ' : ''}{item.types.resourceType ? _.startCase(item.types.resourceType) : 'Content'} published {item.publicationYear} via {item.publisher}
      </div>
    )
  }

  const description = () => {
    if (!item.descriptions[0]) return ''

    return (
      <div className="description">
        {_.truncate(item.descriptions[0].description, { 'length': 750, 'separator': '… '})}
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

  return (
    <div key={item.id} className="panel panel-transparent">
      <div className="panel-body">
        {title()}
        {creators()}
        {metadata()}
        {description()}
        {metricsCounter()}
      </div>
      <div className="panel-footer">
        <a href={item.id}><i className='fa fa-external-link'></i> {item.id}</a>
      </div>
      <br/>
    </div>
  )
}

export default ContentItem
