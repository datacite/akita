import React from 'react'
import { Alert, Row, Col, Badge } from 'react-bootstrap'
import { Person } from 'src/data/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import { orcidFromUrl } from 'src/utils/helpers'
import styles from './PersonMetadata.module.scss'

type Props = {
  metadata: Person
}

const PersonMetadata: React.FunctionComponent<Props> = ({ metadata }) => {
  if (!metadata) return <Alert variant="warning">No content found.</Alert>

  const name = () => {
    if (!metadata.name)
      return (
        <h3 className="work">
          <Link href={'/orcid.org' + orcidFromUrl(metadata.id)}>
            No Title
          </Link>
        </h3>
      )

    return (
      <h3 className="work font-weight-bold">
        <Link href={'/orcid.org' + orcidFromUrl(metadata.id)} id="orcid-link">
          {metadata.name}
          {metadata.alternateName && metadata.alternateName.length > 0 && (
            <div className="subtitle">
              {metadata.alternateName.join(', ')}
            </div>
          )}
        </Link>
      </h3>
    )
  }

  const footer = () => {
    return (<Row>
      <Col className="mt-2">
        <a id="orcid-link" href={metadata.id} className={styles.link}>
          <FontAwesomeIcon icon={faOrcid} /> {metadata.id}
        </a>
      </Col>
    </Row>)
  }

  const orcidLink = (
    <a href={metadata.id} target="_blank" rel="noreferrer">
      ORCID
    </a>
  )

  const impactLink = (
    <a
      href={'https://profiles.impactstory.org/u' + orcidFromUrl(metadata.id)}
      target="_blank"
      rel="noreferrer"
    >
      Impactstory
    </a>
  )

  const europePMCLink = (
    <a
      href={'https://europepmc.org/authors' + orcidFromUrl(metadata.id)}
      target="_blank"
      rel="noreferrer"
    >
      Europe PMC
    </a>
  )

  return (<>
    <Row className="person"><Col>{name()}</Col></Row>
    {metadata.description && <Row><Col className="description biography">{metadata.description}</Col></Row>}
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
                <h5 className="font-weight-bold">Other Identifiers</h5>
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
            <Row><Col><h5 className="font-weight-bold mb-0">Other Profiles</h5></Col></Row>
            <Row><Col id="profile-orcid" className="people-profiles">{orcidLink}</Col></Row>
            <Row><Col id="profile-impactstory" className="people-profiles">{impactLink}</Col></Row>
            <Row><Col id="profile-europepmc" className="people-profiles">{europePMCLink}</Col></Row>
          </Col>
        </Row>
      </>
    )}
    {metadata.country && (
      <Row><Col className="tags">
        <Badge bg="info">{metadata.country.name}</Badge>
      </Col></Row>
    )}
    {footer()}
  </>)
}

export default PersonMetadata
