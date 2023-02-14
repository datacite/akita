import React from 'react'
import { Tabs, Tab, Alert } from 'react-bootstrap'
import { pluralize } from '../../utils/helpers'

import { WorkType } from '../../pages/doi.org/[...doi]'
import CitationFormatter from '../CitationFormatter/CitationFormatter'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import UsageChart from '../UsageChart/UsageChart'
import Claim from '../Claim/Claim'
import { MetadataTable } from '../MetadataTable/MetadataTable'

type Props = {
  doi: WorkType
}

const DoiPresentation: React.FunctionComponent<Props> = ({ doi }) => {
  const [selectedOption, setSelectedOption] = React.useState('')

  if (!doi) return <Alert bsStyle="warning">No works found.</Alert>

  const formattedCitation = () => {
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

  const viewsTabLabel = pluralize(doi.viewCount, 'View')
  const downloadsTabLabel = pluralize(doi.downloadCount, 'Download')

  const viewsOverTime = doi.viewsOverTime.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))
  const downloadsOverTime = doi.downloadsOverTime.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))

  const analyticsBar = () => {
    if (doi.viewCount == 0 && doi.downloadCount == 0) return ''

    return (
      <div className="panel panel-transparent">
        <div className="panel-body nav-tabs-member">
          <Tabs className="content-tabs" id="over-time-tabs">
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
                  type="view"
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
                  type="download"
                />
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <>
      <h3 className="member-results">{'https://doi.org/' + doi.doi}</h3>
      <WorkMetadata metadata={doi} linkToExternal={true} showClaimStatus={false} hideSomeMetadata={true}></WorkMetadata>
      <MetadataTable metadata={doi} />
      { doi.registrationAgency.id == "datacite" && ( 
        <Claim doi_id={doi.doi} />
      )}
      {formattedCitation()}
      {analyticsBar()}
    </>
  )
}

export default DoiPresentation
