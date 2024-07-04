import React from 'react'
import { Row, Col } from 'src/components/Layout-4'

import styles from './Title.module.scss'
import { Rights } from 'src/data/types'
import { License } from '../License/License'


type Props = {
  title: React.ReactElement<any, string | React.JSXElementConstructor<any>>[] | string
  titleLink: string
  link: string
  rights?: Rights[]
}

export const Title: React.FunctionComponent<Props> = ({ title, titleLink, link, rights = [] }) => {


  return (
    <Row className="align-items-baseline p-0">
      <Col xs="auto" className="p-0 pr-4">
        <h3 className="font-weight-bold" id="title">
          <a target="_blank" rel="noreferrer" href={titleLink}>
            {title}
          </a>
        </h3>
      </Col>
      <Col xs="auto" className="p-0">
        <License rights={rights} />
        <a href={link} target="_blank" rel="noreferrer" id="title-link" className={styles.link}>
          {link}
        </a>
      </Col>
    </Row>

  )
}


