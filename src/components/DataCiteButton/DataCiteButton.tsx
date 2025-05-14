'use client'

import React from 'react'
import Link from 'next/link'
import Button, { ButtonProps } from 'react-bootstrap/Button'

import styles from './DataCiteButton.module.scss'

interface Props extends ButtonProps {
  outline?: boolean
}

export default function DataCiteButton(props: Props) {
  const variantStyle = props.variant === 'secondary' ? styles.secondary : styles.primary
  const outlineStyle = props.outline ? styles.outline : ''
  console.log(variantStyle, outlineStyle);

  return <WrapLink {...props}>
    <Button {...props} className={`${props.className ?? ''} ${styles.button} ${variantStyle} ${outlineStyle}`} />
  </WrapLink>
}


function WrapLink(props: Props) {
  if (!props.href) return props.children
  return <Link href={props.href} passHref legacyBehavior>{props.children}</Link>
}
