import * as React from 'react'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { compactNumbers } from '../../utils/helpers'
import { Alert } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faQuoteLeft,
  faInfoCircle,
  faExternalLinkAlt,
  faDownload,
  faBookmark
} from '@fortawesome/free-solid-svg-icons'
// import Pager from '../Pager/Pager'

type Props = {
  dois: RelatedContentList[]
  count: number
  type: string
}

interface RelatedContentList {
  nodes: {
    formattedCitation: string,
    repository: {
      name: string,
      re3dataId: string,
      id: string,
    },
    registrationAgency: {
      name: string,
      id: string,
    },
    member: {
      name: string,
      id: string,
    },
  },
}



const DoiRelatedContent: React.FunctionComponent<Props> = ({dois, type, count}) => {
  if (!dois ) return (
    <Alert bsStyle="warning">
      No content found.
    </Alert>
  )

  const renderResults = () => {
    // const hasNextPage = dois.works.pageInfo ? dois.works.pageInfo.hasNextPage : false
    // const endCursor = dois.works.pageInfo ? dois.works.pageInfo.endCursor : ""
    console.log(dois)
    return (
      <div>
        <ol>
          {dois.nodes.map(doi => (
            <React.Fragment key={doi}>
              <li>{ReactHtmlParser(doi.formattedCitation)} <br/>
              <div className="panel-footer">
              <span className="actions">
              {
              doi.repository.name ? (
               <small className="bookmark">Source:  {ReactHtmlParser(doi.repository.name)}</small>
               ) : (
               <small className="bookmark">Source:  {ReactHtmlParser(doi.registrationAgency.name)})</small>
               )
              }
                             <small className="bookmark"><FontAwesomeIcon icon={faExternalLinkAlt} /> MAgic </small>

              </span>
              </div>
              </li>
            </React.Fragment>
          ))}
        </ol>
        {/* <Pager url={'/doi' + (doi.id) + '/?'} hasNextPage={hasNextPage} endCursor={endCursor}></Pager> */}
      </div>
    )
  }
  


  return (
    <div>
    {renderResults()}
    </div>
  )
}

export default DoiRelatedContent
