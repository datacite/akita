import * as React from 'react'
import WorkMetadata from '../WorkMetadata/WorkMetadata'
import { Alert } from 'react-bootstrap'
import { DoiType } from '../WorkContainer/WorkContainer'

type Props = {
  dois: RelatedContentList
}

interface RelatedContentList {
  totalCount: number
  nodes: DoiType[]
}

const WorkRelatedContent: React.FunctionComponent<Props> = ({ dois }) => {
  if (!dois)
    return (
      <div className="alert-works">
        <Alert bsStyle="warning">No works found.</Alert>
      </div>
    )

  return (
    <React.Fragment>
      {dois.nodes.map((doi) => (
        <React.Fragment key={doi.doi}>
          <WorkMetadata metadata={doi} linkToExternal={false}></WorkMetadata>
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

export default WorkRelatedContent
