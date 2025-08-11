'use client'

import React from 'react'
import Link from 'next/link'
import Button, { ButtonProps } from 'react-bootstrap/Button'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './DataCiteButton.module.scss'

interface Props extends ButtonProps {
  outline?: boolean
  icon?: IconDefinition
  color?: string
}

const COLORS = {
  primary: '#037AAD',
  secondary: '#A3ACB2',
}

export default function DataCiteButton(props: Props) {
  const color = props.color || (props.variant === 'secondary' ? COLORS.secondary : COLORS.primary)
  // const variantStyle = props.variant === 'secondary' ? styles.secondary : styles.primary
  const outlineStyle = props.outline ? styles.outline : ''

  return <WrapLink {...props}>
    <Button
      {...props}
      className={`${props.className ?? ''} ${styles.button} ${outlineStyle}`}
      // @ts-expect-error CSS variable not in type definition
      style={{ '--button-color': color }}
    >
      {props.icon && <FontAwesomeIcon icon={props.icon} className="me-2" />}
      {props.children}
    </Button>
  </WrapLink>
}


function WrapLink(props: Props) {
  if (!props.href) return props.children
  return <Link href={props.href} passHref legacyBehavior>{props.children}</Link>
}
