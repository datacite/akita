import React from 'react'
import { Row, Col } from 'src/components/Layout'

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
    <Row className={styles.row}>
      <Col mdOffset={3} className={"panel panel-transparent " + styles.col}>
        <div className={"panel-body " + styles.body}>
          <div className={styles.container}>
            <h3 className={styles.title} id='title'>
              <a target="_blank" rel="noreferrer" href={titleLink}>
                {parsedTitle}
              </a>
            </h3>
            <div className={styles.details}>
              <License rights={rights} />
              <div className={styles.link}>
                <a href={link} target="_blank" rel="noreferrer" id="title-link">
                  {link}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>

  )
}


