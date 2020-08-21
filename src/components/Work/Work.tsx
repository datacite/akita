import * as React from 'react'
import { Tabs, Tab, Alert } from 'react-bootstrap'
import Pluralize from 'react-pluralize'
import { compactNumbers } from '../../utils/helpers'
import { WorkType } from '../WorkContainer/WorkContainer'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import CitationsChart from '../CitationsChart/CitationsChart'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import UsageChart from '../UsageChart/UsageChart'

type Props = {
  doi: WorkType
}

const DoiPresentation: React.FunctionComponent<Props> = ({ doi }) => {
  if (!doi) return <Alert bsStyle="warning">No works found.</Alert>

  const exportMetadata = () => {
    return (
      <React.Fragment>
        <h3 className="member-results">Export as</h3>
        <div className="export-metadata">         
          <span id="export-xml">
            <a
              target="_blank"
              rel="noreferrer"
              href={
                process.env.NEXT_PUBLIC_API_URL +
                '/application/vnd.datacite.datacite+xml/' +
                doi.doi
              }
            >
              DataCite XML
            </a>
          </span>{' • '}
          <span id="export-json">
            <a
              target="_blank"
              rel="noreferrer"
              href={
                process.env.NEXT_PUBLIC_API_URL +
                '/application/vnd.datacite.datacite+json/' +
                doi.doi
              }
            >
              DataCite JSON
            </a>
          </span>{' • '}
          <span id="export-ld" className="download">
            <a
              target="_blank"
              rel="noreferrer"
              href={
                process.env.NEXT_PUBLIC_API_URL +
                '/application/vnd.schemaorg.ld+json/' +
                doi.doi
              }
            >
              Schema.org JSON-LD
            </a>
          </span>{' • '}
          <span id="export-bibtex" className="download">
            <a
              target="_blank"
              rel="noreferrer"
              href={
                process.env.NEXT_PUBLIC_API_URL +
                '/application/x-bibtex/' +
                doi.doi
              }
            >
              BibTeX
            </a>
          </span>{' • '}
          <span id="export-ris" className="download">
            <a
              target="_blank"
              rel="noreferrer"
              href={
                process.env.NEXT_PUBLIC_API_URL +
                '/application/x-research-info-systems/' +
                doi.doi
              }
            >
              RIS
            </a>
          </span>
          {doi.types.resourceTypeGeneral === 'Software' && (
            <React.Fragment>{' • '}
              <span id="export-codemeta" className="download">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    '/application/vnd.codemeta.ld+json/' +
                    doi.doi
                  }
                >
                  Codemeta
                </a>
              </span>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    )
  }

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

  // Using published until citations over time is fixed https://github.com/datacite/lupo/issues/601#issuecomment-673321894
  const citationsOverTime = doi.citations.published.map((datum) => ({
    year: parseInt(datum.id),
    total: datum.count
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
    if (
      doi.citations.totalCount == 0 &&
      doi.viewCount == 0 &&
      doi.downloadCount == 0
    )
      return ''

    return (
      <div className="panel panel-transparent">
        <div className="panel-body nav-tabs-member">
          <Tabs className="content-tabs" id="over-time-tabs">
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

  return (
    <React.Fragment>
      <h3 className="member-results">{'https://doi.org/' + doi.doi}</h3>
      <WorkMetadata metadata={doi} linkToExternal={true}></WorkMetadata>
      {exportMetadata()}
      {formattedCitation()}
      {analyticsBar()}
    </React.Fragment>
  )
}

export default DoiPresentation
