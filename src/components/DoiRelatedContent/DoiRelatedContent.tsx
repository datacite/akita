import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { Alert } from 'react-bootstrap'
import Pager from '../Pager/Pager'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'

type Props = {
  dois: RelatedContentList
  count: number
  type: string
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface RelatedContentList {
  pageInfo: PageInfo
  nodes: DoiType[]
}



const DoiRelatedContent: React.FunctionComponent<Props> = ({dois}) => {
  if (!dois ) return (
    <Alert bsStyle="warning">
      No content found.
    </Alert>
  )

  const renderResults = () => {

    const hasNextPage = dois.pageInfo ? dois.pageInfo.hasNextPage : false
    const endCursor = dois.pageInfo ? dois.pageInfo.endCursor : ""

    return (
      <div>
        <ol id="related-content-items">
          {dois.nodes.map(doi => (
            <React.Fragment key={doi.doi}>
              <li>
              <DoiMetadata metadata={doi} linkToExternal={false}></DoiMetadata>
              </li>
            </React.Fragment>
          ))}
        </ol>
        <Pager url={'/doi' + "doi" + '/?'} hasNextPage={hasNextPage} endCursor={endCursor}></Pager>
      </div>
    )
  }
  


  return (
    <div id="related-content-list">
    {renderResults()}
    </div>
  )
}

export default DoiRelatedContent
