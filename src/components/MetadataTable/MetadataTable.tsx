import React, { useState } from 'react'
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap'
import { WorkType } from 'src/pages/doi.org/[...doi]'
import truncate from 'lodash/truncate'
import chunk from 'lodash/chunk'
import startCase from 'lodash/startCase'
import ReactHtmlParser from 'react-html-parser'

import styles from './MetadataTable.module.scss'
import WorkPerson from '../WorkPerson/WorkPerson'
import WorkFunding from '../WorkFunding/WorkFunding'
import Claim from '../Claim/Claim'


type Props = {
  metadata: WorkType
}

const METADATA_TYPES = ['description', 'other identifiers', 'creators', 'contributors', 'funders', 'registration'] as const
type MetadataType = typeof METADATA_TYPES[number]

export const MetadataTable: React.FunctionComponent<Props> = ({ metadata }) => {
  const [selectedType, setSelectedType] = useState<MetadataType>('description')

  const description = () => {
    if (!metadata.descriptions[0]) return ''

    const descriptionHtml = truncate(metadata.descriptions[0].description, {
      length: 2500,
      separator: '… '
    })

    return <div className="description">{ReactHtmlParser(descriptionHtml)}</div>
  }

  const otherIdentifiers = () =>
    <>
      {metadata.identifiers.map((id) => (
        <div key={id.identifier} className="work-identifiers">
          {id.identifierType}:{' '}
          <a href={id.identifierUrl} target="_blank" rel="noreferrer">
            {id.identifier}
          </a>
        </div>
      ))}
    </>
  
  const creators = () =>
    chunk(metadata.creators, 3).map((row) => (
      <Row key={row[0].name}>
        {row.map((item) => (
          <Col key={item.name} className="creator-list" md={4}>
            <WorkPerson person={item} />
          </Col>
        ))}
      </Row>
    ))


  const contributors = () =>
    chunk(metadata.contributors, 3).map((row) => (
      <Row key={row[0].name}>
        {row.map((item) => (
          <Col key={item.name} className="contributor-list" md={4}>
            <WorkPerson person={item} />
          </Col>
        ))}
      </Row>
    ))
  
  const funders = () =>
    chunk(metadata.fundingReferences, 3).map((row) => (
      <Row key={row[0].funderName}>
        {row.map((item) => (
          <Col key={item.funderName} className="funder-list" md={4}>
            <WorkFunding funding={item} />
          </Col>
        ))}
      </Row>
    ))

  const registration = () => <Claim doi_id={metadata.doi} />

  const content = () => {
    switch(selectedType) {
      case 'description': return description()
      case 'other identifiers': return otherIdentifiers()
      case 'creators': return creators()
      case 'contributors': return contributors()
      case 'funders': return funders()
      case 'registration': return registration()
      default: alert('default')
    }
  }
  
  return (
      <div style={{ minHeight: 250 }}>
        <ButtonGroup className='btn-group-justified' role='group' style={{ marginBottom: 10 }}>
          {METADATA_TYPES.map(type =>
            <ButtonGroup key={type} role='group'>
              <Button onClick={() => setSelectedType(type)}>{startCase(type)}</Button>
            </ButtonGroup>
          )}
        </ButtonGroup>
        <div className="panel panel-transparent">
          <div className="panel-body">
            {content()}
          </div>
        </div>
      </div>
  )
}


