import React from 'react'
import { Col, Row } from 'react-bootstrap'

import styles from './Title.module.scss'
import { Rights } from 'src/pages/doi.org/[...doi]'
import { License } from '../License/License'


type Props = {
  title: React.ReactElement<any, string | React.JSXElementConstructor<any>>[] | string
  titleLink: string
  link: string
  rights?: Rights[]
}

export const Title: React.FunctionComponent<Props> = ({ title, titleLink, link, rights = [] }) => {


  return (
    <Row className={styles.row}>
      <Col smOffset={3} className="panel panel-transparent">
        <div className="panel-body">
          <div className={styles.container}>
            <h3 className={styles.title} id='title'>
              <a target="_blank" rel="noreferrer" href={titleLink}>
                {title}
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


