import React, { PropsWithChildren } from 'react'
import Link from 'next/link'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { decimalToSexagesimal } from 'geolib'

import type { MinimalOrganization as Organization } from 'src/data/queries/searchOrganizationQuery'
import { rorFromUrl } from 'src/utils/helpers'
import styles from './OrganizationMetadata.module.scss'

type Props = {
  metadata: Organization
  linkToExternal?: boolean
  showTitle?: boolean
}

export default function OrganizationMetadata({
  metadata,
  linkToExternal,
  showTitle = true
}: Props) {

  const memberRoles = {
    "direct_member": "DataCite Member",
    "member_only": "DataCite Member",
    "for-profit_provider": "DataCite Member",
    "consortium": "DataCite Consortium",
    "consortium_organization": "DataCite Consortium Organization"
  }

  const grid = metadata.identifiers.filter((i) => {
    return i.identifierType === 'grid'
  })
  const fundref = metadata.identifiers.filter((i) => {
    return i.identifierType === 'fundref'
  })
  const isni = metadata.identifiers.filter((i) => {
    return i.identifierType === 'isni'
  })
  const wikidata = metadata.identifiers.filter((i) => {
    return i.identifierType === 'wikidata'
  })



  return <>
    <TitleLink id={metadata.id} name={metadata.name} alternateName={metadata.alternateName} linkToExternal={linkToExternal} show={showTitle} />

    <Row>
      <Col xs={6} md={6}>
        {(metadata.url || metadata.wikipediaUrl || metadata.twitter) && (
          <>
            <Row><Col>
              <h5 className="m-0 fw-bold">Links</h5>
            </Col></Row>
            {metadata.url && (
              <Row><Col>
                <a href={metadata.url} target="_blank" rel="noreferrer">
                  Homepage
                </a>
              </Col></Row>
            )}
            {metadata.wikipediaUrl && (
              <Row><Col>
                <a
                  href={metadata.wikipediaUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikipedia
                </a>
              </Col></Row>
            )}
            {metadata.twitter && (
              <Row><Col>
                <a
                  href={'https://twitter.com/' + metadata.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              </Col></Row>
            )}
          </>
        )}
      </Col>
      <Col xs={6} md={6}>
        <Row><Col>
          <h5 className="m-0 fw-bold">Other Identifiers</h5>
        </Col></Row>
        {grid.length > 0 && (
          <Row className="identifier id-type-grid"><Col>
            GRID{' '}{grid[0].identifier}
          </Col></Row>
        )}
        {fundref.length > 0 && <>
          {fundref
            .filter((_, idx) => idx < 5)
            .map((id) => (
              <Row key={id.identifier} className="identifier id-type-crossref-funder"><Col>
                Crossref Funder ID{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={'https://doi.org/' + id.identifier}
                >
                  {id.identifier}
                </a>
              </Col></Row>
            ))}
        </>}
        {isni.length > 0 && <>
          {isni
            .filter((_, idx) => idx < 5)
            .map((id) => (
              <Row key={id.identifier} className="identifier id-type-isni"><Col>
                ISNI{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={'http://isni.org/isni/' + id.identifier}
                >
                  {id.identifier}
                </a>
              </Col></Row>
            ))}
        </>}
        {wikidata.length > 0 && <>
          {wikidata
            .filter((_, idx) => idx < 5)
            .map((id) => (
              <Row key={id.identifier} className="identifier id-type-wikidata"><Col>
                Wikidata{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={'https://www.wikidata.org/wiki/' + id.identifier}
                >
                  {id.identifier}
                </a>
              </Col></Row>
            ))}
        </>}
      </Col>
    </Row>

    <Geolocation geolocation={metadata.geolocation} />

    <Row className="tags"><Col>
      <Badge pill bg="info">{metadata.country.name}</Badge>
      {metadata.types.map((type) => (
        <Badge pill className={styles.badge} key={`type-${type}`} bg="info">{type}</Badge>
      ))}
      {metadata.memberId && (
        <Badge pill bg="success"><i className="ai ai-datacite"></i> {memberRoles[metadata.memberRoleId]}</Badge>
      )}
    </Col></Row>

    <Footer id={metadata.id} />
  </>
}


function Footer({ id }: { id: string }) {
  return (
    <Row className="panel-footer"><Col>
      <a id="ror-link" target="_blank" rel="noreferrer" href={id} className={styles.link}>
        <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" /> {id}
      </a>
    </Col></Row>
  )
}


function Geolocation({ geolocation }: { geolocation: Organization['geolocation'] }) {
  const showLocation =
    geolocation &&
    geolocation.pointLongitude &&
    geolocation.pointLatitude
  if (!showLocation) return null
  const latitude =
    geolocation.pointLatitude > 0
      ? decimalToSexagesimal(geolocation.pointLatitude).toString() +
      ' N, '
      : decimalToSexagesimal(geolocation.pointLatitude).toString() +
      ' S'
  const longitude =
    geolocation.pointLongitude > 0
      ? decimalToSexagesimal(geolocation.pointLongitude).toString() +
      ' W'
      : decimalToSexagesimal(geolocation.pointLongitude).toString() +
      ' E'

  return (
    <Row className="mt-3"><Col className="location">
      <Row><Col><h5 className="m-0 fw-bold">Geolocation</h5></Col></Row>
      <Row><Col>
        <a
          href={`https://geohack.toolforge.org/geohack.php?params=${geolocation.pointLatitude};${geolocation.pointLongitude}_&language=en`}
          target="_blank"
          rel="noreferrer"
        >
          {latitude}
          {longitude}
        </a>
      </Col></Row>
    </Col ></Row >
  )
}



interface TitleProps {
  linkToExternal?: boolean
  id: string
  name: string
  alternateName: string[]
  show: boolean
}

function TitleLink({ linkToExternal, id, name, alternateName, show }: TitleProps) {
  if (!show) return null

  function LinkWrapper({ children }: PropsWithChildren) {
    if (!linkToExternal)
      return <Link prefetch={false} href={'/ror.org' + rorFromUrl(id)} className="fw-bold">{children}</Link>

    return <a target="_blank" rel="noreferrer" href={id}>{children}</a>
  }

  return <Row><Col>
    <h3 className="work">
      <LinkWrapper>
        {name}
        {alternateName.length > 0 && (
          <div className={styles.subtitle}>
            {alternateName.join(', ')}
          </div>
        )}
      </LinkWrapper>
    </h3>
  </Col></Row>
}
