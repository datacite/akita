import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface Props {
  /** Optional sidebar content. When omitted, children are rendered full-width, offset to the main column. */
  sidebar?: React.ReactNode
  /** Main content */
  children?: React.ReactNode
  /** Classes for the sidebar column. Override e.g. for 'pe-5' or 'px-4'. */
  sidebarClassName?: string
  /** Classes for the main column, e.g. 'px-0'. */
  mainClassName?: string
  /** Wrap the grid in a Bootstrap fluid container. */
  fluid?: boolean
  /** Optional class applied to the Row wrapper. */
  className?: string
}

export default function CommonsLayout({
  sidebar,
  children,
  sidebarClassName = 'd-none d-md-block pe-4',
  mainClassName,
  fluid = true,
  className
}: Props) {
  const columns =
    sidebar === undefined ? (
      <Col md={{ span: 9, offset: 3 }} className={mainClassName}>
        {children}
      </Col>
    ) : (
      <>
        <Col md={3} className={sidebarClassName}>
          {sidebar}
        </Col>
        <Col md={9} className={mainClassName}>
          {children}
        </Col>
      </>
    )

  const row = <Row className={className}>{columns}</Row>

  return fluid ? <Container fluid>{row}</Container> : row
}
