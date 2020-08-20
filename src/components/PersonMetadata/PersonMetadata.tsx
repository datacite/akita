import * as React from 'react'
import { Alert, Row, Col, Label } from 'react-bootstrap'
// eslint-disable-next-line no-unused-vars
import { PersonRecord } from '../Person/Person'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import Link from 'next/link'
import { orcidFromUrl } from '../../utils/helpers'

type Props = {
  metadata: PersonRecord
}

const PersonMetadata: React.FunctionComponent<Props> = ({ metadata }) => {
  if (!metadata) return <Alert bsStyle="warning">No content found.</Alert>

  const name = () => {
    if (!metadata.name)
      return (
        <h3 className="work">
          <Link
            href="/orcid.org/[person]"
            as={`/orcid.org${orcidFromUrl(metadata.id)}`}
          >
            <a>No Title</a>
          </Link>
        </h3>
      )

    return (
      <h3 className="work">
        <Link
          href="/orcid.org/[person]"
          as={`/orcid.org${orcidFromUrl(metadata.id)}`}
        >
          <a id="orcid-link">
            {metadata.name}
            {metadata.alternateName && metadata.alternateName.length > 0 && (
              <div className="subtitle">
                {metadata.alternateName.join(', ')}
              </div>
            )}
          </a>
        </Link>
      </h3>
    )
  }

  const footer = () => {
    return (
      <div className="panel-footer">
        <a id="orcid-link" href={metadata.id}>
          <FontAwesomeIcon icon={faOrcid} /> {metadata.id}
        </a>
        <span className="actions">

        </span>
      </div>
    )
  }

  // const workCount = () => {
  //   if (!metadata.works || metadata.works.totalCount == 0) {
  //     return (
  //       <div className="metrics-counter">
  //         <i id="work-count">
  //           <FontAwesomeIcon icon={faScroll} /> No works reported{' '}
  //         </i>
  //       </div>
  //     )
  //   }

  //   return (
  //     <div className="metrics-counter">
  //       <i id="work-count">
  //         <FontAwesomeIcon icon={faScroll} />{' '}
  //         <Pluralize
  //           singular={'Work'}
  //           count={compactNumbers(metadata.works.totalCount)}
  //         />{' '}
  //       </i>
  //     </div>
  //   )
  // }

  // const metricsCounter = () => {
  //   if (metadata.citationCount + metadata.viewCount + metadata.downloadCount == 0) {
  //     return (
  //       <div className="metrics-counter">
  //         <i id="work-count">
  //           <FontAwesomeIcon icon={faScroll} /> No works reported{' '}
  //         </i>
  //       </div>
  //     )
  //   }

  //   return (
  //     <div className="metrics-counter">
  //       <i id="work-count">
  //         <FontAwesomeIcon icon={faScroll} />{' '}
  //         <Pluralize
  //           singular={'Work'}
  //           count={compactNumbers(metadata.works.totalCount)}
  //         />{' '}
  //       </i>
  //     </div>
  //   )
  // }

  // const metricsCounter = () => {
  //   if (metadata.citationCount + metadata.viewCount + metadata.downloadCount == 0) {
  //     return (
  //       <div className="metrics-counter">
  //         <i><FontAwesomeIcon icon={faInfoCircle}/> No citations, views or downloads reported.</i>
  //       </div>
  //     )
  //   }

  //   return (
  //     <div className="metrics-counter">
  //       {metadata.citationCount > 0 &&
  //         <i><FontAwesomeIcon icon={faQuoteLeft}/> <Pluralize singular={'Citation'} count={compactNumbers(metadata.citationCount)} /> </i>
  //       }
  //       {metadata.viewCount > 0 &&
  //         <i><FontAwesomeIcon icon={faEye}/> <Pluralize singular={'View'} count={compactNumbers(metadata.viewCount)} /> </i>
  //       }
  //       {metadata.downloadCount > 0 &&
  //         <i><FontAwesomeIcon icon={faDownload}/> <Pluralize singular={'Download'} count={compactNumbers(metadata.downloadCount)} /> </i>
  //       }
  //     </div>
  //   )
  // }

  return (
    <div key={metadata.id} className="panel panel-transparent">
      <div className="panel-body">
        {name()}
        {metadata.description && (
          <div className="description biography">
            {metadata.description}
          </div>
        )}
        {(metadata.links && metadata.identifiers) && (
          <Row>
            <Col md={6}>
              {metadata.links && metadata.links.length > 0 && (
                <React.Fragment>
                  <h5>Links</h5>
                  {metadata.links.map((link) => (
                    <div key={link.name} className="people-links">
                      <a href={link.url} target="_blank" rel="noreferrer">
                        {link.name}  
                      </a>
                    </div>
                  ))}                
                </React.Fragment>
              )}
            </Col>
            <Col md={6}>
              {metadata.identifiers && metadata.identifiers.length > 0 && (
                <React.Fragment>
                  <h5>Other Identifiers</h5>
                  {metadata.identifiers.map((id) => (
                    <div key={id.identifier} className="people-identifiers">
                      {id.identifierType}: <a href={id.identifierUrl} target="_blank" rel="noreferrer">
                        {id.identifier}  
                      </a>
                    </div>
                  ))}                
                </React.Fragment>
              )}
            </Col>
          </Row>
        )}
        {metadata.country && (
          <div className="tags">
            <Label bsStyle="info">{metadata.country.name}</Label>
          </div>
        )}
      </div>
      {footer()}
    </div>
  )
}

export default PersonMetadata
