'use client'

import React from 'react'
import Link from 'next/link'
import Button, { ButtonProps } from 'react-bootstrap/Button'

import styles from './DataCiteButton.module.scss'

export default function DataCiteButton(props: ButtonProps) {
  const variantStyle = props.variant === 'outline-primary' ? styles.outline : styles.primary

  return <WrapLink {...props}>
    <Button {...props} className={`${props.className} ${styles.button} ${variantStyle}`} />
  </WrapLink>
}


function WrapLink(props: ButtonProps) {
  if (!props.href) return props.children
  return <Link href={props.href} passHref legacyBehavior>{props.children}</Link>
}
