import * as React from 'react'
import { Tabs, Tab, Alert } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import CitationsChart from '../CitationsChart/CitationsChart'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import Pager from '../Pager/Pager'
import { compactNumbers } from '../../utils/helpers'
import DoiRelatedContent from '../DoiRelatedContent/DoiRelatedContent'
import UsageChart from '../UsageChart/UsageChart'

type Props = {
  doi: DoiType
}

const DoiPresentation: React.FunctionComponent<Props> = ({ doi }) => {
  if (!doi) return <Alert bsStyle="warning">No content found.</Alert>

  const formattedCitation = () => {
    const [selectedOption, setSelectedOption] = React.useState('')

    return (
      <div>
        <div id="citation" className="input-group pull-right">
          <select
            className="cite-as"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="apa">APA</option>
            <option value="harvard-cite-them-right">Harvard</option>
            <option value="modern-language-association">MLA</option>
            <option value="vancouver">Vancouver</option>
            <option value="chicago-fullnote-bibliography">Chicago</option>
            <option value="ieee">IEEE</option>
          </select>
        </div>
        <CitationFormatter
          id={doi.doi}
          input={doi.formattedCitation}
          locale="en"
          style={selectedOption}
        ></CitationFormatter>
      </div>
    )
  }

  // const style = {
  //   fontWeight: 600,
  //   color:'#1abc9c',
  //   fontSize: '25px',
  //   padding: 0,
  //   margin: '0 0 .35em 10px',
  // }

  const citationsTabLabel = Pluralize({
    count: compactNumbers(doi.citationCount),
    singular: 'Citation',
    showCount: true
  })
  const viewsTabLabel = Pluralize({
    count: compactNumbers(doi.viewCount),
    singular: 'View',
    showCount: true
  })
  const downloadsTabLabel = Pluralize({
    count: compactNumbers(doi.downloadCount),
    singular: 'Download',
    showCount: true
  })

  const citationsOverTime = doi.citationsOverTime.map((datum) => ({
    year: datum.year,
    total: datum.total
  }))
  const viewsOverTime = doi.viewsOverTime.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))
  const downloadsOverTime = doi.downloadsOverTime.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))

  const analyticsBar = () => {
    if (doi.citations.totalCount == 0) return ''
    
    return (
      <div className="panel panel-transparent">
        <div className="panel-body tab-content nav-tabs-member">
          <Tabs id="over-time-tabs">
            {doi.citationCount > 0 && (
              <Tab
                className="citations-over-time-tab"
                eventKey="citationsOverTime"
                title={citationsTabLabel}
              >
                <CitationsChart
                  data={citationsOverTime}
                  publicationYear={doi.publicationYear}
                  citationCount={doi.citationCount}
                ></CitationsChart>
              </Tab>
            )}
            {doi.viewCount > 0 && (
              <Tab
                className="views-over-time-tab"
                eventKey="viewsOverTime"
                title={viewsTabLabel}
              >
                <UsageChart
                  data={viewsOverTime}
                  counts={doi.viewCount}
                  publicationYear={doi.publicationYear}
                  type="View"
                />
              </Tab>
            )}
            {doi.downloadCount > 0 && (
              <Tab
                className="downloads-over-time-tab"
                eventKey="downloadsOverTime"
                title={downloadsTabLabel}
              >
                <UsageChart
                  data={downloadsOverTime}
                  counts={doi.downloadCount}
                  publicationYear={doi.publicationYear}
                  type="Download"
                />
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    )
  }

  // eslint-disable-next-line no-unused-vars
  const relatedContent = () => {
    const referencesTabLabel = Pluralize({
      count: compactNumbers(doi.references.totalCount),
      singular: 'Reference',
      showCount: true
    })
    const citationsTabLabel = Pluralize({
      count: compactNumbers(doi.citations.totalCount),
      singular: 'Citation',
      showCount: true
    })

    const hasNextPageCitations = doi.citations.pageInfo
      ? doi.citations.pageInfo.hasNextPage
      : false
    const endCursorCitations = doi.citations.pageInfo
      ? doi.citations.pageInfo.endCursor
      : ''

    const hasNextPageReferences = doi.references.pageInfo
      ? doi.references.pageInfo.hasNextPage
      : false
    const endCursorReferences = doi.references.pageInfo
      ? doi.references.pageInfo.endCursor
      : ''

    if (doi.citations.totalCount == 0) return ''

    return (
      <div className="panel panel-transparent">
        <div className="panel-body tab-content nav-tabs-member">
          <Tabs id="related-content-tabs">
            {doi.citations.totalCount > 0 && (
              <Tab
                className="citations-list"
                eventKey="citationsList"
                title={citationsTabLabel}
              >
                <DoiRelatedContent dois={doi.citations} type="citation" />
                <Pager
                  url={'/dois/' + doi.doi + '/?'}
                  hasNextPage={hasNextPageCitations}
                  endCursor={endCursorCitations}
                  isNested={true}
                ></Pager>
              </Tab>
            )}
            {doi.references.totalCount > 0 && (
              <Tab
                className="references-list"
                eventKey="referencesList"
                title={referencesTabLabel}
              >
                <DoiRelatedContent dois={doi.references} type="reference" />
                <Pager
                  url={'/dois/' + doi.doi + '/?'}
                  hasNextPage={hasNextPageReferences}
                  endCursor={endCursorReferences}
                  isNested={true}
                ></Pager>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <h3 className="member-results">{'https://doi.org/' + doi.doi}</h3>
      <DoiMetadata metadata={doi} linkToExternal={true}></DoiMetadata>

      {formattedCitation()}
      {analyticsBar()}
      {relatedContent()}
    </React.Fragment>
  )
}

export default DoiPresentation
