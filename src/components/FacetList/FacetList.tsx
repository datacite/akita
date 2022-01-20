import React from 'react'
import { gql } from '@apollo/client'
import FilterItem from "../FilterItem/FilterItem"

export const FACET_FIELDS = gql`
  fragment facetFields on Facet{
    id
    title
    count
  }
`
export interface Facet {
	name: string
	id: string
	title: string
	count: number
}

type Props = {
	title: string
	name: string
	facets: Facet[]
}


export const FacetList: React.FunctionComponent<Props> = ({
	title,
	name,
	facets
}) => {
	return (
    <>
      {facets.length>0 && (
        <div className="panel facets">
          <div className="panel-body">
            <h4>{title}</h4>
            <ul>
              {facets.map((facet) => (
                  <li key={facet.id}>
                    <FilterItem
                      name={name}
                      id={facet.id}
                      title={facet.title}
                      count={facet.count}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
	)
}
export default FacetList
