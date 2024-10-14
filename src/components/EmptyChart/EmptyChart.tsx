import React from 'react'
import styles from './EmptyChart.module.scss'

interface EmptyChartProps {
  title: string
  children?: React.ReactNode
}

const EmptyChart: React.FunctionComponent<EmptyChartProps> = ({ title, children }) => {
  return (
    <div className={`panel panel-transparent`}>
      <div className={`panel-body ${styles.emptyChart}`}>
        <div className={styles.title}>
          <h4>{title}</h4>
        </div>
        <div className={styles.message}>
          {children || "Not enough data to render this chart"}
        </div>
      </div>
    </div>
  )
}

export default EmptyChart
