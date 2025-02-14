import React from 'react'
import { MetricsDisplay } from 'src/components/MetricsDisplay/MetricsDisplay'
import searchSummaryCounts from 'src/data/queries/searchSummaryQuery'
import { type QueryVar } from 'src/data/queries/searchDoiQuery'

const links = {
  citations: 'https://support.datacite.org/docs/citations-and-references',
  views: 'https://support.datacite.org/docs/views-and-downloads',
  downloads: 'https://support.datacite.org/docs/views-and-downloads'
}


export default function SummarySearchMetrics(variables: QueryVar) {

  const { data, error, isLoading } = searchSummaryCounts(variables)

  if (isLoading) return <div>Loading metrics...</div>
  if (error) return <div>Error loading metrics</div>
  if (!data) return null

  return <MetricsDisplay counts={data} links={links} />
}
