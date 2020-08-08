import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { Alert } from 'react-bootstrap'
// eslint-disable-next-line no-unused-vars
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
  if (!dois) return <Alert bsStyle="warning">No works found.</Alert>

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
