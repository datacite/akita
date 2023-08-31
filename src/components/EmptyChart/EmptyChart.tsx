import React from 'react'
import styles from './EmptyChart.module.scss'
type EmptyChartProps ={
  title: string
}

const EmptyChart: React.FunctionComponent<EmptyChartProps> = ({title}) => {
  return (
    <div className={`panel panel-transparent`}>
      <div className={`panel-body ${styles.emptyChart}`}>
        <div className={styles.title}>
          <h4>{title}</h4>
        </div>
        <div>Not enough data to render this chart</div>
      </div>
    </div>
)
}

export default EmptyChart
