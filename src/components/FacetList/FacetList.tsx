'use client'

import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FacetListItem from './FacetListItem'
import { Facet } from 'src/data/types'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import Accordion from 'react-bootstrap/Accordion';
import styles from './FacetList.module.scss'


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

// Custom InfoTooltip component
const InfoTooltip = ({ text }) => (
  <OverlayTrigger
    placement="top"
    overlay={<Tooltip>{text}</Tooltip>}
  >
    <span
      onClick={(e) => e.stopPropagation()}
      className="ms-2"
      style={{ cursor: 'help' }}
    > <FontAwesomeIcon icon={faQuestionCircle} />
    </span>
  </OverlayTrigger>
);

export default function FacetList(props: FacetListProps) {
  const { data, title, id, param, url, value, checked, radio } = props
  if (!data || data.length === 0) return null

  return (
    <Accordion.Item key={'facet-list-' + id} eventKey={id}
    className={id}>
      <Accordion.Header className={styles.facetheader} as="h4">
        {title}
        {props.tooltipText && <InfoTooltip text={props.tooltipText} /> }
      </Accordion.Header>
      <Accordion.Body>
        {data.map((facet, i) => (
          <FacetListItem
            key={'facet-item- ' +id + '-' + i}
            facet={facet}
            param={param}
            url={url}
            value={value && value(facet.id)}
            checked={checked && checked(i)}
            radio={radio}
          />
        ))}
      </Accordion.Body>
    </Accordion.Item>
  )
}
