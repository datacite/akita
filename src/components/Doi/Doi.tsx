import * as React from 'react'
import { Tabs, Tab, Alert } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import CitationsChart from '../CitationsChart/CitationsChart'
import ContentItem from '../ContentItem/ContentItem'
import { formatNumbers } from '../../utils/helpers'

import UsageChart from '../UsageChart/UsageChart'

type Props = {
  item: DoiType
}

const DoiPresentation: React.FunctionComponent<Props> = ({item}) => {
  if (!item ) return (
    <Alert bsStyle="warning">
        No content found.
      </Alert>
  )
  

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

  const style = {
    fontWeight: 600,  
    color:'#1abc9c',
    fontSize: '25px',
    padding: 0,
    margin: '0 0 .35em 10px',
  }

  const citationsTabLabel = Pluralize({count: formatNumbers(item.citationCount), singular:'Citation', style:style,showCount:true}) 
  const viewsTabLabel = Pluralize({count: formatNumbers(item.viewCount), singular:'View', style:style,showCount:true}) 
  const downloadsTabLabel = Pluralize({count: formatNumbers(item.downloadCount), singular:'Download', style:style,showCount:true}) 
  const referencesTabLabel = Pluralize({count: formatNumbers(item.references.nodes.length), singular:'Reference', style:style,showCount:true}) 
 

  const analyticsBar = () => {

    return (
      <div className="panel panel-transparent">
          <div className="panel-body tab-content nav-tabs-member">
        <Tabs defaultActiveKey="citationsOverTime" id="over-time-tabs">
          {item.citationCount > 0 && 
            <Tab className="citations-over-time-tab" eventKey="citationsOverTime" title={citationsTabLabel}>
              <CitationsChart data={item.citationsOverTime} publicationYear={item.publicationYear} citationCount={item.citationCount}></CitationsChart>
            </Tab>
          }
          {item.viewCount > 0 && 
            <Tab className="views-over-time-tab" eventKey="viewsOverTime" title={viewsTabLabel}>
              <UsageChart data={item.viewsOverTime} counts={item.viewCount} publicationYear={2020} type="View"/> 
            </Tab>
          }
          {item.downloadCount > 0 && 
            <Tab className="downloads-over-time-tab" eventKey="downloadsOverTime" title={downloadsTabLabel}>
              <UsageChart data={item.downloadsOverTime} counts={item.downloadCount} publicationYear={item.publicationYear} type="Download" />
            </Tab>
          }
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
    {item.citations.nodes.length > 0 && 
      <Tab className="citations-list" eventKey="citationsList" title={citationsTabLabel}>
        {/* <RelatedContentList dataInput={item.citations} /> */}
        <p>This feature will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a></p>

      </Tab>
    }
     {item.references.nodes.length > 0 && 
      <Tab className="references-list" eventKey="referencesList" title={referencesTabLabel}>
        {/* <RelatedContentList dataInput={item.references} /> */}
        <p>This feature will be implemented later in 2020. <a href="https://datacite.org/roadmap.html" target="_blank" rel="noreferrer">Provide input</a></p>

      </Tab>
    }
    </Tabs>
    </div>
  </div>
    )
  }

  return (
    <div key={item.id} className="panel panel-transparent">
      <h2 className="member-results">{item.doi}</h2>
        <ContentItem item={item}></ContentItem>
      <br/>
      {formattedCitation()}
      {analyticsBar()}
      {relatedContent()}
    </div>
  )
}

export default DoiPresentation
