import * as React from 'react'
import { Alert} from 'react-bootstrap'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import { PersonRecord } from '../Person/Person'
import { compactNumbers } from '../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import { 
  faQuoteLeft, 
  faInfoCircle, 
  faEye,
  faDownload,
  faScroll
} from '@fortawesome/free-solid-svg-icons'
import ReactHtmlParser from 'react-html-parser'
import Link from 'next/link'
import { orcidFromUrl } from "../../utils/helpers"


type Props = {
  metadata: PersonRecord
}

const PersonMetadata: React.FunctionComponent<Props> = ({metadata}) => {
  if (!metadata ) return (
    <Alert bsStyle="warning">
        No content found.
      </Alert>
  )


  //// Affiliation needs work in the API
  const afilliation = () => {
    if (metadata.affiliation.length < 1) { return null }
    return (
      <div className="metrics-counter">
      <span>From &nbsp; 
      <a id="affiliation" href={metadata.affiliation[0].id}>{metadata.affiliation[0].name}</a></span> 
     </div>
    )
  }

  const name = () => {
    if (!metadata.name) return (
      <h3 className="work">
        <Link href="/people/[person]" as={`/people${(orcidFromUrl(metadata.id))}`}>
          <a>No Title</a>
        </Link>
      </h3>
    )

    const titleHtml = metadata.name

    return (
      <h3 className="work">
        <Link href="/people/[person]" as={`/people${(orcidFromUrl(metadata.id))}`}>
          <a>{ReactHtmlParser(titleHtml)}</a>
        </Link>
      </h3>
    )
  }

  const orcid = () => {

    return (
      <div className="panel-footer">
        <a id="orcid-link" href={metadata.id}><FontAwesomeIcon icon={faOrcid} /> {metadata.id}</a>
      </div>
    )
  }

  const workCount = () => {
    if (metadata.works.totalCount == 0) {
      return (
        <div className="metrics-counter">
  
        <i id="work-count"><FontAwesomeIcon  icon={faScroll}/> No works reported </i>
        </div>
      )
    }


    return (
      <div className="metrics-counter">

      <i id="work-count"><FontAwesomeIcon  icon={faScroll}/> <Pluralize singular={'Work'} count={compactNumbers(metadata.works.totalCount)} /> </i>
      </div>
    )
  }

// eslint-disable-next-line no-unused-vars
  const metricsCounter = () => {
    if (metadata.citationCount + metadata.viewCount + metadata.downloadCount == 0) {
      return (
        <div className="metrics-counter">
          <i><FontAwesomeIcon icon={faInfoCircle}/> No citations, views or downloads reported.</i>
        </div>
      )
    }

    return (
      <div className="metrics-counter">
        {metadata.citationCount > 0 &&
          <i><FontAwesomeIcon icon={faQuoteLeft}/> <Pluralize singular={'Citation'} count={compactNumbers(metadata.citationCount)} /> </i>
        }
        {metadata.viewCount > 0 &&
          <i><FontAwesomeIcon icon={faEye}/> <Pluralize singular={'View'} count={compactNumbers(metadata.viewCount)} /> </i>
        }
        {metadata.downloadCount > 0 &&
          <i><FontAwesomeIcon icon={faDownload}/> <Pluralize singular={'Download'} count={compactNumbers(metadata.downloadCount)} /> </i>
        }
      </div>
    )  
  }


  return (
    <div key={metadata.id} className="panel panel-transparent">
      <div className="panel-body">
        <ul className="counter-list">
        {name()}
        {afilliation()}
        {workCount()}
          {/* {metricsCounter()} */}
          </ul>
        {orcid()}
        <br />
      </div>
    </div>
  )
}

export default PersonMetadata
