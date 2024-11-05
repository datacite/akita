import React from 'react'
import { faQuoteLeft, faDownload } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Work } from 'src/data/types'
import { pluralize } from 'src/utils/helpers'


type Props = {
  metadata: Work
}

export default function MetricsCounter({ metadata }: Props) {
  const citationCount = metadata.citationCount || 0
  const viewCount = metadata.viewCount || 0
  const downloadCount = metadata.downloadCount || 0

  if (citationCount + viewCount + downloadCount == 0) {
    return <div></div>
  }

  return (
    <div className="metrics">
      {citationCount > 0 && (
        <span className="metrics-counter">
          <FontAwesomeIcon icon={faQuoteLeft} size="sm" />{' '}
          {pluralize(citationCount, 'Citation', true)}
        </span>
      )}
      {viewCount > 0 && (
        <span className="metrics-counter">
          <FontAwesomeIcon icon={faEye} size="sm" />{' '}
          {pluralize(viewCount, 'View', true)}
        </span>
      )}
      {downloadCount > 0 && (
        <span className="metrics-counter">
          <FontAwesomeIcon icon={faDownload} size="sm" />{' '}
          {pluralize(downloadCount, 'Download', true)}
        </span>
      )}
    </div>
  )
}


