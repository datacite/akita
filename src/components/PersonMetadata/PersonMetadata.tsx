import React from 'react'
import { Alert, Row, Col, Label } from 'react-bootstrap'
import { pluralize, compactNumbers } from '../../utils/helpers'
// eslint-disable-next-line no-unused-vars
import { PersonRecord } from '../Person/Person'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faOrcid
} from '@fortawesome/free-brands-svg-icons'
import {
  faQuoteLeft,
  faDownload,
} from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { useFeature } from 'flagged'
import Link from 'next/link'
import { orcidFromUrl } from '../../utils/helpers'

type Props = {
  metadata: PersonRecord
}

const PersonMetadata: React.FunctionComponent<Props> = ({ metadata }) => {
  const showMetrics = useFeature('metricsCounter')
  
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

  const metricsCounter = () => {
    if (
      metadata.citationCount + metadata.viewCount + metadata.downloadCount ==
      0
    ) {
      return <div></div>
    }

    return (
      <div className="metrics">
        {metadata.citationCount > 0 && (
          <span className="metrics-counter">
            <FontAwesomeIcon icon={faQuoteLeft} size="sm" />{' '}
            {compactNumbers(metadata.citationCount) + ' ' + pluralize(null, 'Citation')}
          </span>
        )}
        {metadata.viewCount > 0 && (
          <span className="metrics-counter">
            <FontAwesomeIcon icon={faEye} size="sm" />{' '}
            {compactNumbers(metadata.viewCount) + ' ' + pluralize(null, 'View')}
          </span>
        )}
        {metadata.downloadCount > 0 && (
          <span className="metrics-counter">
            <FontAwesomeIcon icon={faDownload} size="sm" />{' '}
            {compactNumbers(metadata.downloadCount) + ' ' + pluralize(null, 'Download')}
          </span>
        )}
      </div>
    )
  }

  const footer = () => {
    return (
      <div className="panel-footer">
        <a id="orcid-link" href={metadata.id}>
          <FontAwesomeIcon icon={faOrcid} /> {metadata.id}
        </a>
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

  const orcidLink = (
    <a href={metadata.id} target="_blank" rel="noreferrer">
      ORCID
    </a>
  )

  const impactLink = (
    <a
      href={'https://profiles.impactstory.org/u/' + orcidFromUrl(metadata.id)}
      target="_blank"
      rel="noreferrer"
    >
      Impactstory
    </a>
  )

  const europePMCLink = (
    <a
      href={'http://europepmc.org/authors/' + orcidFromUrl(metadata.id)}
      target="_blank"
      rel="noreferrer"
    >
      Europe PMC
    </a>
  )

  return (
    <div key={metadata.id} className="panel panel-transparent">
      <div className="panel-body">
        {name()}
        {metadata.description && (
          <div className="description biography">{metadata.description}</div>
        )}
        {metadata.links && metadata.identifiers && (
          <>
            <Row>
              <Col md={6}>
                {metadata.links && metadata.links.length > 0 && (
                  <>
                    <h5>Links</h5>
                    {metadata.links.map((link) => (
                      <div key={link.name} className="people-links">
                        <a href={link.url} target="_blank" rel="noreferrer">
                          {link.name}
                        </a>
                      </div>
                    ))}
                  </>
                )}
              </Col>
              <Col xs={6} md={6}>
                {metadata.identifiers && metadata.identifiers.length > 0 && (
                  <>
                    <h5>Other Identifiers</h5>
                    {metadata.identifiers.map((id) => (
                      <div key={id.identifier} className="people-identifiers">
                        {id.identifierType}:{' '}
                        <a
                          href={id.identifierUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {id.identifier}
                        </a>
                      </div>
                    ))}
                  </>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={6} id="other-profiles">
                <h5>Other Profiles</h5>
                <div id="profile-orcid" className="people-profiles">
                  {orcidLink}
                </div>
                <div id="profile-impactstory" className="people-profiles">
                  {impactLink}
                </div>
                <div id="profile-europepmc" className="people-profiles">
                  {europePMCLink}
                </div>
              </Col>
            </Row>
          </>
        )}
        {showMetrics && (
          metricsCounter()
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
