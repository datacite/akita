import { faQuoteLeft, faDownload } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { WorkType } from 'src/pages/doi.org/[...doi]'
import { pluralize } from '../../utils/helpers'


type Props = {
  metadata: WorkType
}

export const MetricsCounter: React.FunctionComponent<Props> = ({ metadata }) => {

  if (
    metadata.citationCount + metadata.viewCount + metadata.downloadCount ==
    0
  ) {
    return <div></div>
  }

  return (
    <div className="metrics">
      {metadata.citationCount > 0 && (
        <span className="metrics-counter">
          <FontAwesomeIcon icon={faQuoteLeft} size="sm" />{' '}
          {pluralize(metadata.citationCount, 'Citation', true)}
        </span>
      )}
      {metadata.viewCount > 0 && (
        <span className="metrics-counter">
          <FontAwesomeIcon icon={faEye} size="sm" />{' '}
          {pluralize(metadata.viewCount, 'View', true)}
        </span>
      )}
      {metadata.downloadCount > 0 && (
        <span className="metrics-counter">
          <FontAwesomeIcon icon={faDownload} size="sm" />{' '}
          {pluralize(metadata.downloadCount, 'Download', true)}
        </span>
      )}
    </div>
  )
}


