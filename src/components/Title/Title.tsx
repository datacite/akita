import React from 'react'
import { Row, Col } from 'src/components/Layout-4'

import styles from './Title.module.scss'
import { Rights } from 'src/data/types'
import { License } from '../License/License'
import ReactHtmlParser from 'html-react-parser'

type Props = {
  title: string
  titleLink: string
  link: string
  rights?: Rights[]
}

export const Title: React.FunctionComponent<Props> = ({ title, titleLink, link, rights = [] }) => {

  const parsedTitle = ReactHtmlParser(title)

  return (
    <Row className={styles.container}>
      <Col xs="auto" className={styles.title}>
        <h3 id="title">
          <a target="_blank" rel="noreferrer" href={titleLink}>
            {parsedTitle}
          </a>
        </h3>
      </Col>
      <Col xs="auto" className={styles.details}>
        <License rights={rights} />
        <a href={link} target="_blank" rel="noreferrer" id="title-link" className={styles.link}>
          {link}
        </a>
      </Col>
    </Row>

  )
}


