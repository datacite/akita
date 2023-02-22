import React from 'react'
import { Tabs, Tab, Alert } from 'react-bootstrap'
import { pluralize } from '../../utils/helpers'

import { WorkType } from '../../pages/doi.org/[...doi]'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import UsageChart from '../UsageChart/UsageChart'
import Claim from '../Claim/Claim'
import { MetadataTable } from '../MetadataTable/MetadataTable'

type Props = {
  doi: WorkType
}

const DoiPresentation: React.FunctionComponent<Props> = ({ doi }) => {
  if (!doi) return <Alert bsStyle="warning">No works found.</Alert>

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
      {/* <h3 className="member-results">{'https://doi.org/' + doi.doi}</h3> */}
      <MetadataTable metadata={doi} />
      <WorkMetadata metadata={doi} linkToExternal={true} showClaimStatus={false} hideMetadataInTable hideTitle/>
      { doi.registrationAgency.id == "datacite" && ( 
        <Claim doi_id={doi.doi} />
      )}
      {analyticsBar()}
    </>
  )
}

export default DoiPresentation
