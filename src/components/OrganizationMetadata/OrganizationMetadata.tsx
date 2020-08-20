import React from 'react'
import Link from 'next/link'
import { Label, Col, Row } from 'react-bootstrap'
import { rorFromUrl } from '../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'

export interface OrganizationMetadataRecord {
  id: string
  name: string
  alternateNames: string[]
  url: string
  wikipediaUrl: string
  types: string[]
  countryName: string
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

  const footer = () => {
    return (
      <div className="panel-footer">
        <a id="ror-link" target="_blank" rel="noreferrer" href={metadata.id}>
          <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" /> {metadata.id}
        </a>
        <span className="actions">

        </span>
      </div>
    )
  }

  return (
    <div key={metadata.id} className="panel panel-transparent">
      <div className="panel-body">
        <h3 className="work">{titleLink()}</h3>
        <Row>
          <Col md={6}>
            {(metadata.url || metadata.wikipediaUrl) && (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </Col>
          <Col md={6}>
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
              <React.Fragment>
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
              </React.Fragment>
            )}
            {metadata.isni.length > 0 && (
              <React.Fragment>
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
              </React.Fragment>
            )}
            {metadata.wikidata.length > 0 && (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </Col>
        </Row>
        <div className="tags">
          <Label bsStyle="info">{metadata.countryName}</Label>
          <span>
            {metadata.types.map((type) => (
              <Label key="type" bsStyle="info">
                {type}
              </Label>
            ))}
          </span>
        </div>
      </div>
      {footer()}
    </div>
  )
}

export default OrganizationMetadata
