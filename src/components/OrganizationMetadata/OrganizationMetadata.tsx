'use client'

import React from 'react'
import Link from 'next/link'
import { Col, Row, Badge } from 'react-bootstrap-4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'
import { decimalToSexagesimal } from 'geolib'

import { OrganizationRecord } from '../Organization/Organization'
import { rorFromUrl } from '../../utils/helpers'
import styles from './OrganizationMetadata.module.css'

type Props = {
  metadata: OrganizationRecord
  linkToExternal?: boolean
  showTitle?: boolean
}

export default function OrganizationMetadata({
  metadata,
  linkToExternal,
  showTitle = true
}: Props) {
  const showLocation =
    metadata.geolocation &&
    metadata.geolocation.pointLongitude &&
    metadata.geolocation.pointLatitude

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

  const titleLink = () => {
    if (!linkToExternal) {
      return (
        <Link href={'/ror.org' + rorFromUrl(metadata.id)} className="font-weight-bold">
          {metadata.name}
          {metadata.alternateName.length > 0 && (
            <div className={styles.subtitle}>
              {metadata.alternateName.join(', ')}
            </div>
          )}
        </Link>
      )
    } else {
      return (
        <a target="_blank" rel="noreferrer" href={metadata.id}>
          {metadata.name}
          {metadata.alternateName.length > 0 && (
            <div className="subtitle">{metadata.alternateName.join(', ')}</div>
          )}
        </a>
      )
    }
  }

  const geolocation = () => {
    const latitude =
      metadata.geolocation.pointLatitude > 0
        ? decimalToSexagesimal(metadata.geolocation.pointLatitude).toString() +
        ' N, '
        : decimalToSexagesimal(metadata.geolocation.pointLatitude).toString() +
        ' S'
    const longitude =
      metadata.geolocation.pointLongitude > 0
        ? decimalToSexagesimal(metadata.geolocation.pointLongitude).toString() +
        ' W'
        : decimalToSexagesimal(metadata.geolocation.pointLongitude).toString() +
        ' E'

    return (
      <a
        href={`https://geohack.toolforge.org/geohack.php?params=${metadata.geolocation.pointLatitude};${metadata.geolocation.pointLongitude}_&language=en`}
        target="_blank"
        rel="noreferrer"
      >
        {latitude}
        {longitude}
      </a>
    )
  }

  const footer = () => {
    return (
      <Row className="panel-footer"><Col>
        <a id="ror-link" target="_blank" rel="noreferrer" href={metadata.id} className={styles.link}>
          <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" /> {metadata.id}
        </a>
      </Col></Row>
    )
  }

  return (<>
    <Row><Col>
      {showTitle && <h3 className="work">{titleLink()}</h3>}
    </Col></Row>
    <Row>
      <Col xs={6} md={6}>
        {(metadata.url || metadata.wikipediaUrl || metadata.twitter) && (
          <>
            <Row><Col>
              <h5 className="m-0 font-weight-bold">Links</h5>
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
          <h5 className="m-0 font-weight-bold">Other Identifiers</h5>
        </Col></Row>
        {grid.length > 0 && (
          <Row className="identifier id-type-grid"><Col>
            GRID{' '}{grid[0].identifier}
          </Col></Row>
        )}
        {fundref.length > 0 && (
          <>
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
          </>
        )}
        {isni.length > 0 && (
          <>
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
          </>
        )}
        {wikidata.length > 0 && (
          <>
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
          </>
        )}
      </Col>
    </Row>
    {showLocation && (
      <Row className="mt-3"><Col className="location">
        <Row><Col><h5 className="m-0 font-weight-bold">Geolocation</h5></Col></Row>
        <Row><Col>{geolocation()}</Col></Row>
      </Col></Row>
    )}
    <Row className="tags"><Col>
      <Badge variant="info">{metadata.country.name}</Badge>
      <span>
        {metadata.types.map((type) => (
          <Badge key="type" variant="info">
            {type}
          </Badge>
        ))}
      </span>
      {metadata.memberId && (
        <Badge variant="success"><i className="ai ai-datacite"></i> {memberRoles[metadata.memberRoleId]}</Badge>
      )}
    </Col></Row>
    {footer()}
  </>)
}

