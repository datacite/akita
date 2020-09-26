import React from 'react'
import Link from 'next/link'
import { Label, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'
import { decimalToSexagesimal } from 'geolib'
import { useFeature } from 'flagged'

import { rorFromUrl } from '../../utils/helpers'

export interface OrganizationMetadataRecord {
  id: string
  name: string
  memberId: string
  alternateNames: string[]
  inceptionYear: number
  url: string
  wikipediaUrl: string
  twitter: string
  types: string[]
  country: {
    id: string
    name: string
  }
  geolocation: {
    pointLongitude: number
    pointLatitude: number
  }
  identifiers: {
    identifier: string
    identifierType: string
  }[]
  grid: {
    identifier: string
    identifierType: string
  }[]
  fundref: {
    identifier: string
    identifierType: string
  }[]
  isni: {
    identifier: string
    identifierType: string
  }[]
  wikidata: {
    identifier: string
    identifierType: string
  }[]
}

type Props = {
  metadata: OrganizationMetadataRecord
  linkToExternal: boolean
}

export const OrganizationMetadata: React.FunctionComponent<Props> = ({
  metadata,
  linkToExternal
}) => {
  const dataCiteMember = useFeature('dataciteMember')
  const showDataCiteMember = metadata.memberId && dataCiteMember
  const organizationWikidata = useFeature('organizationWikidata')
  const showInceptionYear =
    metadata.inceptionYear && organizationWikidata
  const showTwitter = metadata.twitter && organizationWikidata
  const showLocation =
    metadata.geolocation &&
    metadata.geolocation.pointLongitude &&
    metadata.geolocation.pointLatitude &&
    organizationWikidata

  const titleLink = () => {
    if (!linkToExternal) {
      return (
        <Link
          href="/ror.org/[organization]"
          as={`/ror.org${rorFromUrl(metadata.id)}`}
        >
          <a>
            {metadata.name}
            {metadata.alternateNames.length > 0 && (
              <div className="subtitle">
                {metadata.alternateNames.join(', ')}
              </div>
            )}
          </a>
        </Link>
      )
    } else {
      return (
        <a target="_blank" rel="noreferrer" href={metadata.id}>
          {metadata.name}
          {metadata.alternateNames.length > 0 && (
            <div className="subtitle">{metadata.alternateNames.join(', ')}</div>
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
        {showInceptionYear && (
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
                {showTwitter && (
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
            <div>
              GRID{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  'https://grid.ac/institutes/' + metadata.grid[0].identifier
                }
              >
                {metadata.grid[0].identifier}
              </a>
            </div>
            {metadata.fundref.length > 0 && (
              <>
                {metadata.fundref
                  .filter((_, idx) => idx < 5)
                  .map((id) => (
                    <div key={id.identifier}>
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
            {metadata.isni.length > 0 && (
              <>
                {metadata.isni
                  .filter((_, idx) => idx < 5)
                  .map((id) => (
                    <div key={id.identifier}>
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
            {metadata.wikidata.length > 0 && (
              <>
                {metadata.wikidata
                  .filter((_, idx) => idx < 5)
                  .map((id) => (
                    <div key={id.identifier}>
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
          {showDataCiteMember && (
            <Label bsStyle="success">DataCite Member</Label>
          )}
        </div>
      </div>
      {footer()}
    </div>
  )
}

export default OrganizationMetadata
