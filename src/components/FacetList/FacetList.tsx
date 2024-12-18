'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FacetListItem from './FacetListItem'
import { Facet } from 'src/data/types'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'


interface FacetListProps {
  data: Facet[] | undefined
  title: string
  id: string
  param: string
  url: string

  // eslint-disable-next-line no-unused-vars
  value?: (fid: string) => string
  // eslint-disable-next-line no-unused-vars
  checked?: (index: number) => boolean
  radio?: boolean
  tooltipText?: string
}

export default function FacetList(props: FacetListProps) {
  const { data, title, id, param, url, value, checked, radio } = props
  if (!data || data.length === 0) return null

  function Title() {
    if (!props.tooltipText) return <Col xs={12}><h4>{title}</h4></Col>

    return (
      <Col xs={12}>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltipAuthors">{props.tooltipText}</Tooltip>}
        >
          <h4>{title} <FontAwesomeIcon icon={faQuestionCircle} /></h4>
        </OverlayTrigger>
      </Col>
    )
  }

  return (
    <Row className={`panel facets add ${id}`}>
      <Title />
      <Col xs={12} as="ul">
        {data.map((facet, i) => (
          <FacetListItem
            key={facet.id}
            facet={facet}
            param={param}
            url={url}
            value={value && value(facet.id)}
            checked={checked && checked(i)}
            radio={radio}
          />
        ))}
      </Col>
    </Row>
  )
}
