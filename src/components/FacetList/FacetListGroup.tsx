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
    '--bs-accordion-btn-icon': "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23cdd2d5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 16 16'%3E%3Cpath d='m2 5 6 6 6-6'/%3E%3C/svg%3E\")",
    '--bs-accordion-btn-active-icon': "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23cdd2d5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 16 16'%3E%3Cpath d='m2 5 6 6 6-6'/%3E%3C/svg%3E\")",
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
