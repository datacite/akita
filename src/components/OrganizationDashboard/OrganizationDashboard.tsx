import React from 'react'
import { Works } from 'src/data/types'
import WorksDashboard from '../WorksDashboard/WorksDashboard'

type Props = {
  rorId?: string
  gridId?: string
  crossrefFunderId?: string
  works: Works
}

export interface ContentFacet {
  id: string
  title: string
  count: number
}

const OrganizationDashboard: React.FunctionComponent<Props> = ({
  works,
}) => {
  return (
    <WorksDashboard works={works}>
      {/* <ForceDirectedGraph
          titleText='Organization Works'
          nodes={nodes}
          links={links}
          domain={resourceTypeDomain}
          range={resourceTypeRange} /> */}
    </WorksDashboard>
  )
}

export default OrganizationDashboard
