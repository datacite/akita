'use client'

import React from 'react'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import { Work } from 'src/data/types'
import truncate from 'lodash/truncate'
import chunk from 'lodash/chunk'
import startCase from 'lodash/startCase'
import ReactHtmlParser from 'react-html-parser'

import WorkFunding from '../WorkFunding/WorkFunding'

import styles from './MetadataTable.module.scss'
import PersonTable from '../PersonTable/PersonTable'


type Props = {
  metadata: Work
}

const METADATA_TYPES = ['description', 'other identifiers', 'creators', 'contributors', 'funders', 'registration'] as const
type MetadataType = typeof METADATA_TYPES[number]

export const MetadataTable: React.FunctionComponent<Props> = ({ metadata }) => {
  const description = (title, key) => {
    if (!metadata.descriptions || !metadata.descriptions[0]) return ''

    const descriptionHtml = truncate(metadata.descriptions[0].description, {
      length: 2500,
      separator: '… '
    })

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      <div className="panel panel-transparent">
        <div className="panel-body">
          <div className="description">{ReactHtmlParser(descriptionHtml)}</div>
        </div>
      </div>
    </Tab>
  }

  const otherIdentifiers = (title, key) => {
    if (!metadata.identifiers || metadata.identifiers.length === 0) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      <div className="panel panel-transparent">
        <div className="panel-body">
          {metadata.identifiers.map((id) => (
            <div key={id.identifier} className="work-identifiers">
              {id.identifierType}:{' '}
              <a href={id.identifierUrl} target="_blank" rel="noreferrer">
                {id.identifier}
              </a>
            </div>
          ))}
        </div>
      </div>
    </Tab>
  }
  
  const creators = (title, key) => {
    if (!metadata.creators || metadata.creators.length === 0) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      <div className="panel panel-transparent">
        <div className="panel-body creator-list">
          <PersonTable people={metadata.creators} />
        </div>
      </div>
    </Tab>
  }


  const contributors = (title, key) => {
    if (!metadata.contributors || metadata.contributors.length === 0) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      <div className="panel panel-transparent contributor-list">
        <div className="panel-body">
          <PersonTable people={metadata.contributors} />
        </div>
      </div>
    </Tab>
  }
  
  const funders = (title, key) => {
    if (!metadata.fundingReferences || metadata.fundingReferences.length === 0) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      <div className="panel panel-transparent">
        <div className="panel-body">
          {chunk(metadata.fundingReferences, 3).map((row) => (
            <Row key={row[0].funderName}>
              {row.map((item) => (
                <Col key={item.funderName} className="funder-list" md={4}>
                  <WorkFunding funding={item} />
                </Col>
              ))}
            </Row>
          ))}
        </div>
      </div>
    </Tab>
  }

  const registration = (title, key) => {
    if (!metadata.registrationAgency) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      <div className="panel panel-transparent">
        <div className="panel-body">
          DOI registered
          {metadata.registered && (
            <span>
              {' '}
              {new Date(metadata.registered).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}{' '}
          via {metadata.registrationAgency.name}
        </div>
      </div>
    </Tab>
  }

  const tab = (type: MetadataType, index: number) => {
    switch(type) {
      case 'description': return description(type, index)
      case 'other identifiers': return otherIdentifiers(type, index)
      case 'creators': return creators(type, index)
      case 'contributors': return contributors(type, index)
      case 'funders': return funders(type, index)
      case 'registration': return registration(type, index)
      default: alert('default')
    }
  }
  
  return (
    <div className="panel panel-transparent">
      <div className="panel-body">
        <div className={styles.container + ' nav-tabs-member'}>
          <Tabs className="content-tabs">
            {METADATA_TYPES.map((type, index) => tab(type, index)
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}


