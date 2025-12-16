'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

  const router = useRouter()

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

  const handleClick = () => {
    router.push(url + params.toString(), { scroll: false })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <ListGroup.Item as="li" key={facet.id}>
    <div 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={styles.facetlink}
      role="button"
      tabIndex={0}
    >
      <FontAwesomeIcon icon={icon} />
      <span className={styles.facetTitle}>
        {facet.title}
        {tooltipText && <InfoTooltip text={tooltipText} />}
      </span>
      <span>{facet.count > 0 && facet.count.toLocaleString('en-US')}</span>
    </div>
    </ListGroup.Item>
  )
}
