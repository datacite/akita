'use client'

import React from 'react'
import Link from 'next/link'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSquare, faCheckSquare,
  faCircle, faDotCircle,
} from '@fortawesome/free-regular-svg-icons'
import { Facet } from 'src/data/types'
import styles from './FacetListItem.module.scss'

interface Props {
  facet: Facet
  param: string
  url: string

  checked?: boolean
  radio?: boolean
  value?: string
}

export default function FacetListItem(props: Props) {
  const {
    facet,
    param,
    url,

    checked = false,
    radio = false,
    value: customValue
  } = props

  const searchParams = useSearchParams()

  const checkIcon = radio ? faDotCircle : faCheckSquare
  const uncheckIcon = radio ? faCircle : faSquare
  let icon = checked ? checkIcon : uncheckIcon

  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));

  const value = customValue || facet.id

  if (params.get(param) == value) {
    // if param is present, delete from query and use checked icon
    params.delete(param)
    icon = checkIcon
  } else {
    // otherwise replace param with new value and use unchecked icon
    params.set(param, value)
  }

  return (
    <Row as="li" key={facet.id}>
      <Col xs={1} className={styles.checkbox}>
        <Link prefetch={false} href={url + params.toString()} className={"facet-" + param}>
          <FontAwesomeIcon icon={icon} />{' '}
        </Link>
      </Col>
      <Col xs="auto" className="facet-title flex-grow-1">{facet.title}</Col>
      <Col className="number text-end">{facet.count.toLocaleString('en-US')}</Col>
    </Row>
  )
}
