import React from 'react'
import { compactNumbers } from '../../utils/helpers'
import HelpIcon from '../HelpIcon/HelpIcon'

import styles from './MetricsDisplay.module.scss'


type Props = {
  counts: {
    works?: number
    deposits?: number
    citations?: number
    views?: number
    downloads?: number
  }

  links?: {
    works?: string
    deposits?: string
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
      "label": "Deposits",
      "count": counts.deposits,
      "link": links.deposits
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

  const metricList = metricsData.map( (metric, index) => 
  <>
    {metric.count>0 &&(
      <React.Fragment key={"metric-"+index}>
        <dd>{compactNumbers(metric.count)}</dd>
        <dt>{metric.label} <HelpIcon link={metric.link} size={20} position='inline' /></dt>
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


