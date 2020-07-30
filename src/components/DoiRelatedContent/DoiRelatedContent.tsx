import * as React from 'react'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import DoiMetadata from '../DoiMetadata/DoiMetadata'
import { doiFromUrl } from '../../utils/helpers'
import { Alert } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCopy,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import Pager from '../Pager/Pager'
import Link from 'next/link'

type Props = {
  dois: RelatedContentList[]
  count: number
  type: string
}

interface PageInfo {
  endCursor: string
  hasNextPage: boolean
}

interface RelatedContentList {
  pageInfo: PageInfo
  nodes: {
    id: string,
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



const DoiRelatedContent: React.FunctionComponent<Props> = ({dois, type, count, id}) => {
  if (!dois ) return (
    <Alert bsStyle="warning">
      No content found.
    </Alert>
  )

  const renderResults = () => {

    const hasNextPage = dois.nodes.pageInfo ? dois.nodes.pageInfo.hasNextPage : false
    const endCursor = dois.nodes.pageInfo ? dois.nodes.pageInfo.endCursor : ""

    console.log(dois)
    return (
      <div>
        <ol>
          {dois.nodes.map(doi => (
            <React.Fragment key={doi.id}>
              <li>{ReactHtmlParser(doi.formattedCitation)} <br/>
              <div className="panel-footer">
              <span className="actions">
              {
              doi.repository.name ? (
               <small className="bookmark">Source:  {ReactHtmlParser(doi.repository.name)} </small>
               ) : (
               <small className="bookmark">Source:  {ReactHtmlParser(doi.registrationAgency.name)}  /t </small>
               )
              }
                <a className="bookmark"><FontAwesomeIcon icon={faCopy} /> Copy Citation </a>
                <a className="bookmark" target="_blank" rel="noopener" href={doi.id}><FontAwesomeIcon icon={faExternalLinkAlt} /> {doi.id} </a>
                <span className="bookmark">
                  <Link href="/dois/[...doi]" as={`/dois${(doiFromUrl(doi.id))}`}> 
                    <a><FontAwesomeIcon icon={faExternalLinkAlt} />  Link to Content </a>
                  </Link>
                </span>
              </span>
              </div>
              <br/>
              </li>
            </React.Fragment>
          ))}
        </ol>
        <Pager url={'/doi' + id + '/?'} hasNextPage={hasNextPage} endCursor={endCursor}></Pager>
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
