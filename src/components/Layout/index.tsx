'use client'

import React, { Grid as RBGrid, GridProps, Row as RBRow, RowProps, Col as RBCol, ColProps, Alert as RBAlert, AlertProps } from 'react-bootstrap'

export function Grid (props: GridProps) {
  return <RBGrid {...props}>{props.children}</RBGrid>
}

export function Row (props: RowProps) {
  return <RBRow {...props}>{props.children}</RBRow>
}

export function Col (props: ColProps) {
  return <RBCol {...props}>{props.children}</RBCol>
}

export function Alert (props: AlertProps) {
  return <RBAlert {...props}>{props.children}</RBAlert>
}