'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSquare, faCheckSquare,
  faCircle, faDotCircle,
} from '@fortawesome/free-regular-svg-icons'
import { Facet } from 'src/data/types'
import styles from './FacetListItem.module.scss'
import ListGroup from 'react-bootstrap/ListGroup';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';

interface Props {
  facet: Facet
  param: string
  url: string
  tooltipText?: string

  checked?: boolean
  radio?: boolean
  value?: string
}

export default function FacetListItem(props: Props) {
  const {
    facet,
    param,
    url,
    tooltipText,

    checked = false,
    radio = false,
    value: customValue
  } = props


  const checkIcon = radio ? faDotCircle : faCheckSquare
  const uncheckIcon = radio ? faCircle : faSquare
  let icon = checked ? checkIcon : uncheckIcon

  const searchParams = useSearchParams()
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
  params.delete('cursor')

  return (
    <ListGroup.Item as="li" key={facet.id}>
    <Link prefetch={false} href={url + params.toString()} className={styles.facetlink}>
      <FontAwesomeIcon icon={icon} />
      <span className={styles.facetTitle}>
        {facet.title}
        {tooltipText && <InfoTooltip text={tooltipText} />}
      </span>
      <span>{facet.count?.toLocaleString('en-US')}</span>
    </Link>
    </ListGroup.Item>
  )
}
