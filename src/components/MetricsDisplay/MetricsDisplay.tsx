import React from 'react'
import { compactNumbers } from '../../utils/helpers'
import HelpIcon from '../HelpIcon/HelpIcon'

import styles from './MetricsDisplay.module.scss'


type Props = {
  counts: {
    works?: number
    citations?: number
    views?: number
    downloads?: number
  }

  links?: {
    works?: string
    citations?: string
    views?: string
    downloads?: string
  }
}

export function MetricsDisplay({ counts, links = {} }: Props) {

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

  const metricList = metricsData.filter(metric => metric.count && metric.count > 0).map((metric, index) =>
    <React.Fragment key={"metric-" + index}>
      <dd>{compactNumbers(metric.count || 0)}</dd>
      <dt>{metric.label} <HelpIcon link={metric.link} size={20} position='inline' /></dt>
    </React.Fragment>
  )
  return (
    <div className={styles.metrics}>
      <dl>
        {metricList}
      </dl>
    </div>
  )
}


