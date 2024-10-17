'use client'

import React from 'react'
import { Alert, Tabs, Tab } from 'react-bootstrap'
import { pluralize } from 'src/utils/helpers'

import { Work } from 'src/data/types'
import WorkMetadata from 'src/components/WorkMetadata/WorkMetadata'
import UsageChart from 'src/components/UsageChart/UsageChart'
import MetadataTable from 'src/components/MetadataTable/MetadataTable'
import MetricsCounter from 'src/components/MetricsCounter/MetricsCounter'

type Props = {
  doi: Work
}

export default function DoiPresentation({ doi }: Props) {
  if (!doi) return <Alert variant="warning">No works found.</Alert>

  const views = doi.viewCount || 0
  const downloads = doi.downloadCount || 0

  const viewsTabLabel = pluralize(views, 'View')
  const downloadsTabLabel = pluralize(downloads, 'Download')

  const viewsOverTime = doi.viewsOverTime?.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))
  const downloadsOverTime = doi.downloadsOverTime?.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))

  const analyticsBar = () => {
    if (views == 0 && downloads == 0) return ''

    return (
      <div className="panel panel-transparent">
        <div className="panel-body">
          <Tabs className="content-tabs nav-tabs-member" id="over-time-tabs">
            {views > 0 && (
              <Tab
                className="views-over-time-tab"
                eventKey="viewsOverTime"
                title={viewsTabLabel}
              >
                <UsageChart
                  data={viewsOverTime}
                  counts={views}
                  publicationYear={doi.publicationYear}
                  type="view"
                />
              </Tab>
            )}
            {downloads > 0 && (
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
      <MetricsCounter metadata={doi} />
      <MetadataTable metadata={doi} />
      <WorkMetadata metadata={doi} linkToExternal={true} showClaimStatus={false} hideMetadataInTable hideTitle />
      {analyticsBar()}
    </>
  )
}

