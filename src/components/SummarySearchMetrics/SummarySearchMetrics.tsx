import React from 'react'
import { MetricsDisplay } from 'src/components/MetricsDisplay/MetricsDisplay'
import useSearchSummaryCounts from 'src/data/queries/searchSummaryQuery'
import { type QueryVar } from 'src/data/queries/searchDoiQuery'
import ContentLoader from "react-content-loader"

const StatsLoader = () => (
  <ContentLoader
    speed={2}
    width={700}
    height={65}
    viewBox="0 0 700 65"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect y="0" x="0" rx="5" ry="5" width="18%" height="10%" />
    <rect y="0" x="23%" rx="5" ry="5" width="18%" height="10%" />
    <rect y="0" x="46%" rx="5" ry="5" width="18%" height="10%" />
    <rect y="0" x="69%" rx="5" ry="5" width="18%" height="10%" />
    <rect y="15%" x="0" rx="5" ry="5" width="89%" height="75%" />
  </ContentLoader>
)

export const SummaryStatsLoader = () => (
  <div className="d-flex" style={{ width: "100%" }}>
    <StatsLoader />
  </div>
)

const links = {
  citations: 'https://support.datacite.org/docs/citations-and-references',
  views: 'https://support.datacite.org/docs/views-and-downloads',
  downloads: 'https://support.datacite.org/docs/views-and-downloads'
}



export default function SummarySearchMetrics(variables: QueryVar) {

  const { data, error, isLoading } = useSearchSummaryCounts(variables)

  if (isLoading) return <SummaryStatsLoader />
  if (!data || error) return null

  const displayWorksTotal = !variables.organizationRelationType

  return <MetricsDisplay counts={data} links={links} displayWorksTotal={displayWorksTotal} />
}
