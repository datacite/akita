import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import { Person } from 'src/data/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import { orcidFromUrl } from 'src/utils/helpers'
import styles from './PersonMetadata.module.scss'
import { MetricsDisplay } from 'src/components/MetricsDisplay/MetricsDisplay'

type Props = {
  metadata: Person
  url: string
}

const PersonMetadata: React.FunctionComponent<Props> = ({ metadata, url }) => {
  if (!metadata) return <Alert variant="warning">No content found.</Alert>

  const name = () => {
    const title_link = onPersonPage() ? 'https://orcid.org/' + orcidFromUrl(metadata.id) : '/orcid.org' + orcidFromUrl(metadata.id)
    if (!metadata.name)
      return (
        <h3 className="work">
          <Link href={title_link}>
            No Title
          </Link>
        </h3>
      )

    return (
      <h3 className="work fw-bold">
        <Link href={title_link}>
          {metadata.name}
          {metadata.alternateName && metadata.alternateName.length > 0 && (
            <div className={styles.subtitle}>
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

  const hasMetrics = () => {
    return (metadata?.totalWorks?.totalCount  || metadata.citationCount  || metadata.viewCount  || metadata.downloadCount) > 0
  }

  const onPersonPage = () => {
    return ['orcid.org/?'].includes(url)
  }

  return (<>
    <Row className={`person ${onPersonPage() ? 'mb-4' : ''}`}><Col>{name()}</Col></Row>
    {hasMetrics() &&
      <Row><Col>
        <MetricsDisplay
          counts={{ works: metadata?.totalWorks?.totalCount, citations: metadata.citationCount, views: metadata.viewCount, downloads: metadata.downloadCount }}
          links={{
            citations: 'https://support.datacite.org/docs/citations-and-references',
            views: 'https://support.datacite.org/docs/views-and-downloads',
            downloads: 'https://support.datacite.org/docs/views-and-downloads'
          }}
        />
      </Col></Row>
    }
    {metadata.description && <Row><Col className="description biography">{metadata.description}</Col></Row>}
    {metadata.links && metadata.identifiers && (
      <>
        <Row>
            {metadata.links && metadata.links.length > 0 && (
              <Col xs={12} md={4} className='my-2'>
                <h5 className='fw-bold'>Links</h5>
                {metadata.links.map((link) => (
                  <div key={link.name} className="people-links">
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.name}
                    </a>
                  </div>
                ))}
              </Col>
            )}
            {metadata.identifiers && metadata.identifiers.length > 0 && (
              <Col xs={12} md={4} className='my-2'>
                <h5 className="fw-bold">Other Identifiers</h5>
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
              </Col>
            )}
          <Col xs={12} md={4} className='my-2' id="other-profiles">
            <h5 className="fw-bold">Other Profiles</h5>
            <div id="profile-orcid" className="people-profiles">{orcidLink}</div>
            <div id="profile-impactstory" className="people-profiles">{impactLink}</div>
            <div id="profile-europepmc" className="people-profiles">{europePMCLink}</div>
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
