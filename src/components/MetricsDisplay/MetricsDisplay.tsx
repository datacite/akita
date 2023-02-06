import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { compactNumbers } from '../../utils/helpers'

import styles from './MetricsDisplay.module.scss'


type Props = {
  counts: {
    works: number
    citations: number
    views: number
    downloads: number
  }

  links?: {
    works?: string
    citations?: string
    views?: string
    downloads?: string
  }
}

export const MetricsDisplay: React.FunctionComponent<Props> = ({ counts, links = {} }) => {

  const metricsData = [
    {
      "label": "Works",
      "count": counts.works,
      "link": links.works
    },
    {
      "label": "Citations",
      "count": counts.citations,
      "link": links.citations
    },
    {
      "label": "Views",
      "count": counts.views,
      "link": links.views
    },
    {
      "label": "Downloads",
      "count": counts.downloads,
      "link": links.downloads
    }
  ];

  const helpIcon = (link) => {
    if (!link) return 
    return (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className='help-icon'
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
      </a>
    )
  }

  const metricList = metricsData.map( (metric, index) => 
  <>
    {metric.count>0 &&(
      <React.Fragment key={"metric-"+index}>
        <dt>{metric.label} {helpIcon(metric.link)}</dt>
        <dd>{compactNumbers(metric.count)}</dd>
      </React.Fragment >
    )}
    </>
  )
  return (
      <div className={styles.metrics}>
        <dl>
          {metricList}
        </dl>
      </div>
  )
}


