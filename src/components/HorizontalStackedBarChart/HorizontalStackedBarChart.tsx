'use client'

import React, { useEffect, useRef, useState } from 'react'
import { VegaLite } from 'react-vega'
import EmptyChart from 'src/components/EmptyChart/EmptyChart'
import HelpIcon from 'src/components/HelpIcon/HelpIcon'
import styles from './HorizontalStackedBarChart.module.scss'
import stackedBarChartSpec from './HorizontalStackedBarChartSpec'


type Props = {
  chartTitle: string
  topCategory: { title: string, percent: number }
  data: HorizontalBarRecord[]
  range: string[]
  domain: string[]
  tooltipText?: string
}

export interface HorizontalBarRecord {
  title: string
  count: number
}

const HorizontalBarChart: React.FunctionComponent<Props> = ({
  chartTitle,
  topCategory,
  data,
  range,
  domain,
  tooltipText
}) => {
  const [width, setWidth] = useState(500);
  const graphDivRef = useRef<HTMLDivElement | null>(null);

  function handleResize() {
    if (!graphDivRef.current) return
    setWidth(graphDivRef.current.offsetWidth - 20);
  }


  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  useEffect(() => {
    handleResize();
  });



  if (data.length == 0) {
    return <EmptyChart title={`Percent ${Array.isArray(chartTitle) ? chartTitle.join(' ') : chartTitle}`} />
  }

  if (domain) {
    const indices = data.map(d => domain.findIndex(dom => dom === d.title))
    domain = domain.filter((_, i) => indices.includes(i))
    range = range.filter((_, i) => indices.includes(i))
  }



  return (
    <div className="panel panel-transparent">
      <div className="panel-body production-chart" ref={graphDivRef}>
        <div className={styles.chartText}>
          {chartTitle}
          {tooltipText && <HelpIcon text={tooltipText} padding={25} position='inline' color='#34495E' />}
        </div>
        <div className={styles.chartDetail}>
          <span className={styles.chartDetailText}>{topCategory.title}</span>
          <span className={styles.chartDetailText}>{topCategory.percent}%</span>
        </div>
        <VegaLite
          renderer="svg"
          spec={stackedBarChartSpec(width, domain, range)}
          data={{ rawData: data }}
          actions={false}
          padding={0}
        />
      </div>
    </div>
  )
}

export default HorizontalBarChart
