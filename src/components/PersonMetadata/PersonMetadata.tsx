import * as React from 'react'
import { Alert} from 'react-bootstrap'
import Pluralize from 'react-pluralize'
// eslint-disable-next-line no-unused-vars
import { PersonType } from '../PersonContainer/PersonContainer'
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
  item: PersonType
}

const PersonPresentation: React.FunctionComponent<Props> = ({item}) => {
  if (!item ) return (
    <Alert bsStyle="warning">
        No content found.
      </Alert>
  )


  //// Affiliation needs work in the API
  // const afilliation = () => {
  //   return (
  //   )
  // }

  const name = () => {
    if (!item.name) return (
      <h3 className="work">
        <Link href="/people/[person]" as={`/people${(orcidFromUrl(item.id))}`}>
          <a>No Title</a>
        </Link>
      </h3>
    )

    const titleHtml = item.name

    return (
      <h3 className="work">
        <Link href="/people/[person]" as={`/people${(orcidFromUrl(item.id))}`}>
          <a>{ReactHtmlParser(titleHtml)}</a>
        </Link>
      </h3>
    )
  }

  const orcid = () => {

    return (
      <div className="panel-footer">
        <a id="orcid-link" href={item.id}><FontAwesomeIcon icon={faOrcid} /> {item.id}</a>
      </div>
    )
  }

  const workCount = () => {
    if (item.works.totalCount == 0) {
      return (
        <div className="metrics-counter">
  
        <i id="work-count"><FontAwesomeIcon  icon={faScroll}/> No works reported </i>
        </div>
      )
    }


    return (
      <div className="metrics-counter">

      <i id="work-count"><FontAwesomeIcon  icon={faScroll}/> <Pluralize singular={'Work'} count={compactNumbers(item.works.totalCount)} /> </i>
      </div>
    )
  }


  const metricsCounter = () => {
    if (item.citationCount + item.viewCount + item.downloadCount == 0) {
      return (
        <div className="metrics-counter">
          <i><FontAwesomeIcon icon={faInfoCircle}/> No citations, views or downloads reported.</i>
        </div>
      )
    }

    return (
      <div className="metrics-counter">
        {item.citationCount > 0 &&
          <i><FontAwesomeIcon icon={faQuoteLeft}/> <Pluralize singular={'Citation'} count={compactNumbers(item.citationCount)} /> </i>
        }
        {item.viewCount > 0 &&
          <i><FontAwesomeIcon icon={faEye}/> <Pluralize singular={'View'} count={compactNumbers(item.viewCount)} /> </i>
        }
        {item.downloadCount > 0 &&
          <i><FontAwesomeIcon icon={faDownload}/> <Pluralize singular={'Download'} count={compactNumbers(item.downloadCount)} /> </i>
        }
      </div>
    )  
  }


  return (
    <div key={item.id} className="panel panel-transparent">
      <div className="panel-body">
        <ul className="counter-list">
        {name()}
        {/* {afilliation()} */}
          {workCount()}
          {metricsCounter()}
          </ul>
        {orcid()}
        <br />
      </div>
    </div>
  )
}

export default PersonPresentation
