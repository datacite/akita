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

interface Props {
  facet: Facet
  param: string
  url: string
  
  checked?: boolean
  radio?: boolean
  value?: string
}

export default function FacetListItem (props: Props) {
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
    <li key={facet.id}>
      <Link href={url + params.toString()} className={"facet-" + param}>
        <FontAwesomeIcon icon={icon} />{' '}
      </Link>
      <div className="facet-title">{facet.title}</div>
      <span className="number pull-right">{facet.count.toLocaleString('en-US')}</span>
      <div className="clearfix" />
    </li>
  )
}