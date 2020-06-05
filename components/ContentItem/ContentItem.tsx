import * as React from 'react'
import _ from 'lodash'

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
  const creators = !item.creators ? '' : item.creators.map((creator) =>
    creator.familyName ? [creator.givenName, creator.familyName].join(' ') : creator.name
  ).join(', ');
  const title = {__html: item.titles[0].title + ' <span class="small">' + item.types.resourceTypeGeneral + '</span>' }
  const description = {__html: item.descriptions[0] ? item.descriptions[0].description : '' }

  return (
    <div key={item.id} className="panel panel-transparent">
      <div className="panel-body">
        <h3 className="member" dangerouslySetInnerHTML={title} />
        {creators}
        <div className="metadata">{item.types.resourceType ? _.startCase(item.types.resourceType) : 'Content'} published {item.publicationYear} via {item.publisher}</div>
        <div className="description" dangerouslySetInnerHTML={description} />
      </div>
      <div className="panel-footer">
        <a href={item.id}><i className='fa fa-external-link'></i> {item.id}</a>
      </div>
      <br/>
    </div>
  )
}

export default ContentItem
