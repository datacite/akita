import React from 'react'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import { WorkType } from 'src/pages/doi.org/[...doi]'
import truncate from 'lodash/truncate'
import chunk from 'lodash/chunk'
import startCase from 'lodash/startCase'
import ReactHtmlParser from 'react-html-parser'

import WorkPerson from '../WorkPerson/WorkPerson'
import WorkFunding from '../WorkFunding/WorkFunding'


type Props = {
  metadata: WorkType
}

const METADATA_TYPES = ['description', 'other identifiers', 'creators', 'contributors', 'funders', 'registration'] as const
type MetadataType = typeof METADATA_TYPES[number]

export const MetadataTable: React.FunctionComponent<Props> = ({ metadata }) => {
  const description = (title, key) => {
    if (!metadata.descriptions[0]) return ''

    const descriptionHtml = truncate(metadata.descriptions[0].description, {
      length: 2500,
      separator: '… '
    })

    return <Tab key={key} eventKey={key} title={startCase(title)}>
        <div className="description">{ReactHtmlParser(descriptionHtml)}</div>
      </Tab>
  }

  const otherIdentifiers = (title, key) => {
    if (!metadata.identifiers || metadata.identifiers.length === 0) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      {metadata.identifiers.map((id) => (
        <div key={id.identifier} className="work-identifiers">
          {id.identifierType}:{' '}
          <a href={id.identifierUrl} target="_blank" rel="noreferrer">
            {id.identifier}
          </a>
        </div>
      ))}
    </Tab>
  }
  
  const creators = (title, key) => {
    if (!metadata.creators || metadata.creators.length === 0) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      {chunk(metadata.creators, 3).map((row) => (
        <Row key={row[0].name}>
          {row.map((item) => (
            <Col key={item.name} className="creator-list" md={4}>
              <WorkPerson person={item} />
            </Col>
          ))}
        </Row>
      ))}
    </Tab>
  }


  const contributors = (title, key) => {
    if (!metadata.contributors || metadata.contributors.length === 0) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      {chunk(metadata.contributors, 3).map((row) => (
        <Row key={row[0].name}>
          {row.map((item) => (
            <Col key={item.name} className="contributor-list" md={4}>
              <WorkPerson person={item} />
            </Col>
          ))}
        </Row>
      ))}
    </Tab>
  }
  
  const funders = (title, key) => {
    if (!metadata.fundingReferences || metadata.fundingReferences.length === 0) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
      {chunk(metadata.fundingReferences, 3).map((row) => (
        <Row key={row[0].funderName}>
          {row.map((item) => (
            <Col key={item.funderName} className="funder-list" md={4}>
              <WorkFunding funding={item} />
            </Col>
          ))}
        </Row>
      ))}
    </Tab>
  }

  const registration = (title, key) => {
    if (!metadata.registrationAgency) return

    return <Tab key={key} eventKey={key} title={startCase(title)}>
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
      via {metadata.registrationAgency.name}.
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
      <div style={{ minHeight: 250, marginTop: 50 }}>
        <Tabs bsStyle='tabs' justified>
          {METADATA_TYPES.map((type, index) => tab(type, index)
          )}
        </Tabs>
      </div>
  )
}


