import * as React from 'react'
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { Alert } from 'react-bootstrap'
import { DoiType } from '../DoiContainer/DoiContainer'

type Props = {
  dois: RelatedContentList
  type?: string
}

interface RelatedContentList {
  totalCount: number
  nodes: DoiType[]
}

const DoiRelatedContent: React.FunctionComponent<Props> = ({ dois }) => {
  if (!dois) return (
    <div className="alert-works">
      <Alert bsStyle="warning">No works found.</Alert>
    </div>
  )

  return (
    <React.Fragment>
      {dois.nodes.map((doi) => (
        <React.Fragment key={doi.doi}>
          <DoiMetadata metadata={doi} linkToExternal={false}></DoiMetadata>
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

export default DoiRelatedContent
