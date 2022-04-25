import React from 'react'
import Link from 'next/link'
import { Label, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'
import { decimalToSexagesimal } from 'geolib'

import { OrganizationRecord } from '../Organization/Organization'
import { rorFromUrl } from '../../utils/helpers'

type Props = {
  metadata: OrganizationRecord
  linkToExternal?: boolean
}

export const OrganizationMetadata: React.FunctionComponent<Props> = ({
  metadata,
  linkToExternal
}) => {
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
        <Link
          href={'/ror.org' + rorFromUrl(metadata.id)}
        >
          <a>
            {metadata.name}
            {metadata.alternateName.length > 0 && (
              <div className="subtitle">
                {metadata.alternateName.join(', ')}
              </div>
            )}
          </a>
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
      <div className="panel-footer">
        <a id="ror-link" target="_blank" rel="noreferrer" href={metadata.id}>
          <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" /> {metadata.id}
        </a>
      </div>
    )
  }

  return (
    <div key={metadata.id} className="panel panel-transparent">
      <div className="panel-body">
        <h3 className="work">{titleLink()}</h3>
        {metadata.inceptionYear && (
          <div className="inception-year">Founded {metadata.inceptionYear}</div>
        )}
        <Row>
          <Col xs={6} md={6}>
            {(metadata.url || metadata.wikipediaUrl || metadata.twitter) && (
              <>
                <h5>Links</h5>
                {metadata.url && (
                  <div>
                    <a href={metadata.url} target="_blank" rel="noreferrer">
                      Homepage
                    </a>
                  </div>
                )}
                {metadata.wikipediaUrl && (
                  <div>
                    <a
                      href={metadata.wikipediaUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Wikipedia
                    </a>
                  </div>
                )}
                {metadata.twitter && (
                  <div>
                    <a
                      href={'https://twitter.com/' + metadata.twitter}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Twitter
                    </a>
                  </div>
                )}
              </>
            )}
          </Col>
          <Col xs={6} md={6}>
            <h5>Other Identifiers</h5>
            {grid.length > 0 && (
              <div className="identifier id-type-grid">
                GRID{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    'https://grid.ac/institutes/' + grid[0].identifier
                  }
                >
                  {grid[0].identifier}
                </a>
              </div>
            )}
            {fundref.length > 0 && (
              <>
                {fundref
                  .filter((_, idx) => idx < 5)
                  .map((id) => (
                    <div key={id.identifier} className="identifier id-type-crossref-funder">
                      Crossref Funder ID{' '}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={'https://doi.org/' + id.identifier}
                      >
                        {id.identifier}
                      </a>
                    </div>
                  ))}
              </>
            )}
            {isni.length > 0 && (
              <>
                {isni
                  .filter((_, idx) => idx < 5)
                  .map((id) => (
                    <div key={id.identifier} className="identifier id-type-isni">
                      ISNI{' '}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={'http://isni.org/isni/' + id.identifier}
                      >
                        {id.identifier}
                      </a>
                    </div>
                  ))}
              </>
            )}
            {wikidata.length > 0 && (
              <>
                {wikidata
                  .filter((_, idx) => idx < 5)
                  .map((id) => (
                    <div key={id.identifier} className="identifier id-type-wikidata">
                      Wikidata{' '}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={'https://www.wikidata.org/wiki/' + id.identifier}
                      >
                        {id.identifier}
                      </a>
                    </div>
                  ))}
              </>
            )}
          </Col>
        </Row>
        {showLocation && (
          <div className="location">
            <h5>Geolocation</h5>
            {geolocation()}
          </div>
        )}
        <div className="tags">
          <Label bsStyle="info">{metadata.country.name}</Label>
          <span>
            {metadata.types.map((type) => (
              <Label key="type" bsStyle="info">
                {type}
              </Label>
            ))}
          </span>
          {metadata.memberId && (
            <Label bsStyle="success"><i className="ai ai-datacite"></i> {memberRoles[metadata.memberRoleId]}</Label>
          )}
        </div>
      </div>
      {footer()}
    </div>
  )
}

export default OrganizationMetadata
