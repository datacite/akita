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
  const { href, color, variant, outline, className, icon, children, ...rest } = props
  const buttonColor = color || (variant === 'secondary' ? COLORS.secondary : COLORS.primary)
  const outlineStyle = outline ? styles.outline : ''

  return <WrapLink href={href}>
    <Button
      {...rest}
      className={`${className ?? ''} ${styles.button} ${outlineStyle}`}
      // @ts-expect-error CSS variable not in type definition
      style={{ '--button-color': buttonColor }}
    >
      {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
      {children}
    </Button>
  </WrapLink>
}


function WrapLink(props: Props) {
  if (!props.href) return props.children
  return <Link href={props.href}>{props.children}</Link>
}
