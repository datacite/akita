'use client'

import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import startCase from 'lodash/startCase'
import truncate from 'lodash/truncate'
import { orcidFromUrl } from 'src/utils/helpers'
import ReactHtmlParser from 'html-react-parser'
import sanitizeHtml from 'sanitize-html'
import Link from 'next/link'

import { Work } from 'src/data/types'
import ClaimStatus from 'src/components/ClaimStatus/ClaimStatus'
import { MetricsDisplay } from 'src/components/MetricsDisplay/MetricsDisplay'
import { License } from 'src/components/License/License'
import MetricsCounter from 'src/components/MetricsCounter/MetricsCounter'
import styles from './WorkMetadata.module.scss'

type Props = {
  metadata: Work
  linkToExternal?: boolean
  showClaimStatus?: boolean
  hideTitle?: boolean
  hideMetadataInTable?: boolean
  includeMetricsDisplay?: boolean
}

export default function WorkMetadata({
  metadata,
  linkToExternal,
  showClaimStatus,
  hideTitle = false,
  hideMetadataInTable = false,
  includeMetricsDisplay = false
}: Props) {
  if (metadata == null)
    return <Alert variant="warning">No content found.</Alert>

  // use production URL for non-DataCite DOIs
  const handleUrl =
    metadata.registrationAgency.id === 'datacite'
      ? metadata.id
      : 'https://doi.org/' + metadata.doi

  const searchtitle = () => {
    if (!metadata.titles[0])
      return (
        <h3 className="work">
          <Link prefetch={false} href={'/doi.org/' + metadata.doi}>
            No Title
          </Link>
        </h3>
      )

    const titleHtml = metadata.titles[0].title
    const sanitizedTitle = sanitizeHtml(titleHtml)

    return (
      <h3 className="work">
        <Link prefetch={false} href={'/doi.org/' + metadata.doi}>
          {ReactHtmlParser(sanitizedTitle)}
        </Link>
      </h3>
    )
  }

  const externalTitle = () => {
    if (!metadata.titles[0]) return <h3 className="member">No Title</h3>

    const titleHtml = metadata.titles[0].title
    const sanitizedTitle = sanitizeHtml(titleHtml)

    return (
      <h3 className="work">
        <a target="_blank" rel="noreferrer" href={handleUrl}>
          {ReactHtmlParser(sanitizedTitle)}
        </a>
      </h3>
    )
  }

  const title = () => {
    if (linkToExternal) {
      return externalTitle()
    } else {
      return searchtitle()
    }
  }

  const creators = () => {
    if (!metadata.creators || !metadata.creators[0]) {
      return <div className="creators">No creators</div>
    }

    const creatorList = metadata.creators.reduce(
      (sum, creator, index, array) => {
        const c = creator.familyName
          ? [creator.givenName, creator.familyName].join(' ')
          : creator.name

        const creatorId = orcidFromUrl(creator.id)
        // padding depending on position in creators list
        switch (true) {
          case array.length > index + 2:
            sum.push({ displayName: c + ', ', id: creatorId  })
            break
          case array.length > index + 1:
            sum.push({ displayName: c + ' & ', id: creatorId })
            break
          default:
            sum.push({ displayName: c, id: creatorId })
            break
        }
        return sum
      },
      [] as { displayName: string; id: string | null }[]
    )

    return (
      <div className="creators">
        {creatorList.map((c, index) =>
          c.id !== null ? (
            <Link prefetch={false} href={'/orcid.org/' + c.id} key={index}>
              {c.displayName}
            </Link>
          ) : (
            c.displayName
          )
        )}
      </div>
    )
  }

  const claim = metadata.claims ? metadata.claims[0] : null

  const container = () => {
    if (metadata.container
      && metadata.container.identifier
      && metadata.container.title) {
      return (
        <>
          {' '}
          in{' '}
          <a
            href={
              '/doi.org?query=container.identifier:' +
              metadata.container.identifier
            }
          >
            {metadata.container.title}
          </a>
        </>
      )
    } else if (
      metadata.repository &&
      metadata.repository.id &&
      metadata.repository.id !== 'crossref.citations'
    ) {
      return (
        <>
          {' '}
          in{' '}
          <a href={'/repositories/' + metadata.repository.id}>
            {metadata.repository.name}
          </a>
        </>
      )
    } else {
      return <> via {metadata.publisher.name}</>
    }
  }

  const metadataTag = () => {
    return (
      <div className="metadata">
        {metadata.version ? 'Version ' + metadata.version + ' of ' : ''}
        {metadata.types.resourceType
          ? startCase(metadata.types.resourceType)
          : 'Content'}{' '}
        published {metadata.publicationYear}
        {container()}
      </div>
    )
  }

  const description = () => {
    if (!metadata.descriptions || !metadata.descriptions[0]) return ''

    const descriptionHtml = truncate(metadata.descriptions[0].description, {
      length: 2500,
      separator: '… '
    })

    const sanitizedDescription = sanitizeHtml(descriptionHtml)
    const parsedDescription = ReactHtmlParser(sanitizedDescription)

    return <div className="description">{parsedDescription}</div>
  }

  const registered = () => {
    return (
      <div className="registered">
        DOI registered
        {metadata.registered && (
          <span>
            {' '}
            {new Date(metadata.registered).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        )}{' '}
        via {metadata.registrationAgency.name}.
      </div>
    )
  }

  const tooltipResourceTypeGeneral = (
    <Tooltip id="tooltipResourceTypeGeneral">The content type.</Tooltip>
  )

  const tooltipFieldsOfScience = (
    <Tooltip id="tooltipFieldsOfScience">
      The OECD Fields of Science for the content.
    </Tooltip>
  )

  const tooltipLanguage = (
    <Tooltip id="tooltipLanguage">The primary language of the content.</Tooltip>
  )

  let resourceType = metadata.types.resourceTypeGeneral
  if (
    metadata.registrationAgency.id !== 'datacite' &&
    metadata.types.resourceType
  )
    resourceType = metadata.types.resourceType

  const tags = () => {
    return (
      <div className="tags">
        {resourceType && (
          <OverlayTrigger placement="top" overlay={tooltipResourceTypeGeneral}>
            <Badge pill bg="info">{startCase(resourceType)}</Badge>
          </OverlayTrigger>
        )}
        {metadata.fieldsOfScience && (
          <span>
            {metadata.fieldsOfScience?.map((fos) => (
              <OverlayTrigger
                key={fos.id}
                placement="top"
                overlay={tooltipFieldsOfScience}
              >
                <Badge pill bg="info">{fos.name}</Badge>
              </OverlayTrigger>
            ))}
          </span>
        )}
        {metadata.language && (
          <OverlayTrigger placement="top" overlay={tooltipLanguage}>
            <Badge pill bg="info">{metadata.language.name}</Badge>
          </OverlayTrigger>
        )}
        {claim && showClaimStatus && (
          <ClaimStatus claim={claim} type={'label'} />
        )}
      </div>
    )
  }

  const footer = () => {
    return (
      <Col className="panel-footer" sm={12}>
        <a href={handleUrl} className={styles.doiLink}>
          <i className="ai ai-doi"></i> {handleUrl}
        </a>
      </Col>
    )
  }

  return (
    <Row>
      <Col className="card-body">
        {!hideTitle && title()}
        {includeMetricsDisplay && <MetricsDisplay counts={{ citations: metadata.citationCount, views: metadata.viewCount, downloads: metadata.downloadCount }} />}
        {!hideMetadataInTable && creators()}
        {metadataTag()}
        {!hideMetadataInTable && <>{description()}
          {metadata.identifiers && metadata.identifiers.length > 0 && (
            <Row>
              <Col xs={6} md={6} className="other-identifiers">
                <h5>Other Identifiers</h5>
                {metadata.identifiers.map((id) => (
                  <div key={id.identifier} className="work-identifiers">
                    {id.identifierType}:{' '}
                    <a href={id.identifierUrl} target="_blank" rel="noreferrer" className={styles.id}>
                      {id.identifier}
                    </a>
                  </div>
                ))}
              </Col>
            </Row>
          )}
          {registered()}</>}
        {!hideMetadataInTable && <License rights={metadata.rights} />}
        {!hideMetadataInTable && <MetricsCounter metadata={metadata} />}
        {tags()}
      </Col>

      {footer()}
    </Row>
  )
}
