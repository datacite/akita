import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Image from 'next/image'
import {
  faCreativeCommons,
  faCreativeCommonsBy,
  faCreativeCommonsNc,
  faCreativeCommonsNd,
  faCreativeCommonsSa,
  faCreativeCommonsZero
} from '@fortawesome/free-brands-svg-icons'
import uniqBy from 'lodash/uniqBy'

import styles from './Title.module.scss'
import { Rights } from 'src/pages/doi.org/[...doi]'


type Props = {
  title: React.ReactElement<any, string | React.JSXElementConstructor<any>>[]
  url: string
  link: string
  rights?: Rights[]
}

export const Title: React.FunctionComponent<Props> = ({ title, url, link, rights = [] }) => {

  const license = () => {
    const uniqueRights = uniqBy([...rights], 'rightsIdentifier')
    const ccRights = uniqueRights.reduce((sum, r) => {
      if (r.rightsIdentifier && r.rightsIdentifier.startsWith('cc')) {
        const splitIdentifier = r.rightsIdentifier
          .split('-')
          .filter((l) => ['cc', 'cc0', 'by', 'nc', 'nd', 'sa'].includes(l))
        splitIdentifier.forEach((l) => {
          switch (l) {
            case 'by':
              sum.push({
                icon: faCreativeCommonsBy,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            case 'nc':
              sum.push({
                icon: faCreativeCommonsNc,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            case 'nd':
              sum.push({
                icon: faCreativeCommonsNd,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            case 'sa':
              sum.push({
                icon: faCreativeCommonsSa,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            case 'cc0':
              sum.push({
                icon: faCreativeCommons,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              sum.push({
                icon: faCreativeCommonsZero,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            default:
              sum.push({
                icon: faCreativeCommons,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
          }
        })
      }
      return sum
    }, [])

    const otherRights = uniqueRights.reduce((sum, r) => {
      const ri = { rightsIdentifier: null }
      if (r.rightsIdentifier && !r.rightsIdentifier.startsWith('cc')) {
        if (r.rightsIdentifier.startsWith('apache')) {
          ri.rightsIdentifier = 'Apache%202.0'
        } else if (r.rightsIdentifier.startsWith('ogl')) {
          ri.rightsIdentifier = 'OGL%20Canada'
        } else {
          ri.rightsIdentifier = r.rightsIdentifier
            .replace(/-/g, '%20')
            .toUpperCase()
        }
        sum.push(ri)
      }
      return sum
    }, [])

    if (!ccRights[0] && !otherRights[0]) return ''

    return (
      <div className={'license ' + styles.license}>
        {ccRights.map((r, index) => (
          <a href={r.rightsUri} key={index} target="_blank" rel="noreferrer">
            <FontAwesomeIcon key={r.rightsIdentifier} icon={r.icon} />
          </a>
        ))}
        {otherRights.map((r) => (
          <a
            href={r.rightsUri}
            key={r.rightsIdentifier}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={`https://img.shields.io/badge/license-${r.rightsIdentifier}-blue.svg`}
              width={76}
              height={20}
            />
          </a>
        ))}
      </div>
    )
  }


  return (
    <Row className={styles.row}>
      <Col smOffset={3} className="panel panel-transparent" id="title">
        <div className="panel-body">
          <div className={styles.container}>
            <h3 className={styles.title}>
              <a target="_blank" rel="noreferrer" href={url}>
                {title}
              </a>
            </h3>
            <div className={styles.details}>
              {license()}
              <div className={styles.link}>
                <a href={link} target="_blank" rel="noreferrer">
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


