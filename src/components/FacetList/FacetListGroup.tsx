import React from 'react'
import Accordion from 'react-bootstrap/Accordion';

interface FacetListGroupProps {
  defaultActiveKey: string[] | undefined
  children: React.ReactNode
}
export default function FacetListGroup(props: FacetListGroupProps) {
  const accordionStyle = {
    '--bs-accordion-border-width': '0',
    '--bs-accordion-btn-color': '#1abc9c',
    '--bs-accordion-active-color': '#1abc9c',
    '--bs-accordion-active-bg': 'transparent',
    '--bs-accordion-body-padding-x': '0rem',
    '--bs-accordion-body-padding-y': '0.5rem',
    '--bs-accordion-btn-padding-x': '0rem',
    '--bs-accordion-btn-padding-y': '1.0rem',
    '--bs-accordion-inner-border-radius': '0rem',
    '--bs-accordion-inner-border': '1px solid #cdd2d5',
  } as React.CSSProperties;

  return (
      <Accordion
        className={`facetlist-group`}
        alwaysOpen
        defaultActiveKey={props.defaultActiveKey}
        style={accordionStyle}
      >
      {props.children}
      </Accordion>
  )
}
