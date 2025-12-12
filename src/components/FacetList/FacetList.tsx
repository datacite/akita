'use client'

import React from 'react'
import FacetListItem from './FacetListItem'
import { Facet } from 'src/data/types'
import Accordion from 'react-bootstrap/Accordion';
import styles from './FacetList.module.scss'
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';

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
            tooltipText={facet.tooltipText}
          />
        ))}
      </Accordion.Body>
    </Accordion.Item>
  )
}
