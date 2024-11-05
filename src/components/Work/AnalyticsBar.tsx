import { Tabs, Tab } from 'src/components/ReactBootstrap'
import UsageChart from 'src/components/UsageChart/UsageChart'

import { pluralize } from 'src/utils/helpers'
import type { Work } from 'src/data/types'


interface Props {
  doi: Work
}


export default function AnalyticsBar({ doi }: Props) {
  const views = doi.viewCount || 0
  const downloads = doi.downloadCount || 0

  if (views == 0 && downloads == 0) return ''

  const viewsOverTime = doi.viewsOverTime?.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))
  const downloadsOverTime = doi.downloadsOverTime?.map((datum) => ({
    yearMonth: datum.yearMonth,
    total: datum.total
  }))

  const viewsTabLabel = pluralize(views, 'View')
  const downloadsTabLabel = pluralize(downloads, 'Download')

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
                counts={downloads}
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
