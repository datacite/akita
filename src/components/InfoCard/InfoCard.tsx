import React from 'react'
import styles from 'src/components/InfoCard/InfoCard.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

type Props = {
  icon: IconDefinition
  title: string | string[] | React.ReactNode
  body: string | string[] | React.ReactNode
}

const InfoCard: React.FunctionComponent<Props> = ({ title, body, icon }) => {
  return (
    <div className={`${styles['info-panel']} panel panel-transparent`}>
      <div className="panel-body">
        <FontAwesomeIcon className={styles['info-panel-icon']} icon={icon} aria-hidden="true" />
        <h3>
          {title}
        </h3>
        <p>{body}</p>
      </div>
    </div>
  )
}

export default InfoCard
