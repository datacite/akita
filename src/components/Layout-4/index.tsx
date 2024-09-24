'use client'

import React from 'react'
import RBContainer, { ContainerProps } from 'react-bootstrap-4/Container'
import RBRow, { RowProps } from 'react-bootstrap-4/Row'
import RBCol, { ColProps } from 'react-bootstrap-4/Col'
import RBAlert, { AlertProps } from 'react-bootstrap-4/Alert'

export function Grid(props: ContainerProps) {
  return <RBContainer {...props}>{props.children}</RBContainer>
}

export function Container(props: ContainerProps) {
  return <RBContainer {...props}>{props.children}</RBContainer>
}


export function Row(props: RowProps) {
  return <RBRow {...props}>{props.children}</RBRow>
}

export function Col(props: ColProps) {
  return <RBCol {...props}>{props.children}</RBCol>
}

export function Alert(props: AlertProps) {
  return <RBAlert {...props}>{props.children}</RBAlert>
}
