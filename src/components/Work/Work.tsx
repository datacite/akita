import React from 'react'
import Alert from 'react-bootstrap/Alert'

import { Work } from 'src/data/types'
import WorkMetadata from 'src/components/WorkMetadata/WorkMetadata'
import MetadataTable from 'src/components/MetadataTable/MetadataTable'
import MetricsCounter from 'src/components/MetricsCounter/MetricsCounter'
import AnalyticsBar from './AnalyticsBar'

interface Props {
  doi: Work
}

export default function DoiPresentation({ doi }: Props) {
  if (!doi) return <Alert variant="warning">No works found.</Alert>

  return <>
    <MetricsCounter metadata={doi} />
    <MetadataTable metadata={doi} />
    <WorkMetadata metadata={doi} linkToExternal={true} showClaimStatus={false} hideMetadataInTable hideTitle />
    <AnalyticsBar doi={doi} />
  </>
}
