import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import styles from './FacetListGroup.module.scss'

interface FacetListGroupProps {
  defaultActiveKey: string[] | undefined
  children: React.ReactNode
}
export default function FacetListGroup(props: FacetListGroupProps) {

  return (
      <Accordion
        className={styles.facetListGroup}
        alwaysOpen
        defaultActiveKey={props.defaultActiveKey}
      >
      {props.children}
      </Accordion>
  )
}
