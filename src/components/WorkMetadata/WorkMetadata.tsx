import React from 'react'
import { OverlayTrigger, Alert, Label, Tooltip } from 'react-bootstrap'
import startCase from 'lodash/startCase'
import truncate from 'lodash/truncate'
import uniqBy from 'lodash/uniqBy'
import Pluralize from 'react-pluralize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faQuoteLeft,
  faExternalLinkAlt,
  faDownload,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import {
  faCreativeCommons,
  faCreativeCommonsBy,
  faCreativeCommonsNc,
  faCreativeCommonsNd,
  faCreativeCommonsSa,
  faCreativeCommonsZero,
  faTwitter,
  faFacebook
} from '@fortawesome/free-brands-svg-icons'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share'
import ReactHtmlParser from 'react-html-parser'
import Link from 'next/link'
import { WorkType } from '../WorkContainer/WorkContainer'
import { compactNumbers, orcidFromUrl } from '../../utils/helpers'

type Props = {
  metadata: WorkType
  linkToExternal?: boolean
}

const WorkMetadata: React.FunctionComponent<Props> = ({
  metadata,
  linkToExternal
}) => {
  if (metadata == null)
    return <Alert bsStyle="warning">No content found.</Alert>

  // use production URL for non-DataCite DOIs
  const handleUrl =
    metadata.registrationAgency.id === 'datacite'
      ? metadata.id
      : 'https://doi.org/' + metadata.doi

  const searchtitle = () => {
    if (!metadata.titles[0])
      return (
        <h3 className="work">
          <Link href="/doi.org/[...doi]" as={`/doi.org/${metadata.doi}`}>
            <a>No Title</a>
          </Link>
        </h3>
      )

    const titleHtml = metadata.titles[0].title

    return (
      <h3 className="work">
        <Link href="/doi.org/[...doi]" as={`/doi.org/${metadata.doi}`}>
          <a>{ReactHtmlParser(titleHtml)}</a>
        </Link>
      </h3>
    )
  }

  const externalTitle = () => {
    if (!metadata.titles[0]) return <h3 className="member">No Title</h3>

    const titleHtml = metadata.titles[0].title

    return (
      <h3 className="work">
        <a target="_blank" rel="noreferrer" href={handleUrl}>
          {ReactHtmlParser(titleHtml)}
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

        // padding depending on position in creators list
        switch (true) {
          case array.length > index + 2:
            sum.push({ displayName: c + ', ', id: orcidFromUrl(creator.id) })
            break
          case array.length > index + 1:
            sum.push({ displayName: c + ' & ', id: orcidFromUrl(creator.id) })
            break
          default:
            sum.push({ displayName: c, id: orcidFromUrl(creator.id) })
            break
        }
        return sum
      },
      []
    )

    return (
      <div className="creators">
        {creatorList.map((c, index) =>
          c.id !== null ? (
            <Link
              href="/orcid.org/[orcid]"
              key={index}
              as={`/orcid.org${c.id}`}
            >
              <a>{c.displayName}</a>
            </Link>
          ) : (
            c.displayName
          )
        )}
      </div>
    )
  }

  const container = () => {
    if (metadata.container && metadata.container.identifier) {
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
          <a href={'/doi.org?query=client.uid:' + metadata.repository.id}>
            {metadata.repository.name}
          </a>
        </>
      )
    } else {
      return <> via {metadata.publisher}</>
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
    if (!metadata.descriptions[0]) return ''

    const descriptionHtml = truncate(metadata.descriptions[0].description, {
      length: 750,
      separator: '… '
    })

    return <div className="description">{ReactHtmlParser(descriptionHtml)}</div>
  }

  const license = () => {
    let rights = [...metadata.rights]
    const uniqueRights = uniqBy(rights, 'rightsIdentifier')
    const ccRights = uniqueRights.reduce((sum, r) => {
      if (r.rightsIdentifier && r.rightsIdentifier.startsWith('cc')) {
        const splitIdentifier = r.rightsIdentifier
          .split('-')
          .filter((l) => ['cc', 'cc0', 'by', 'nc', 'nd', 'sa'].includes(l))
        splitIdentifier.forEach((l) => {
          switch (l) {
            case 'by':
              sum.push({
                icon: faCreativeCommonsBy,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            case 'nc':
              sum.push({
                icon: faCreativeCommonsNc,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            case 'nd':
              sum.push({
                icon: faCreativeCommonsNd,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            case 'sa':
              sum.push({
                icon: faCreativeCommonsSa,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            case 'cc0':
              sum.push({
                icon: faCreativeCommons,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              sum.push({
                icon: faCreativeCommonsZero,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
              break
            default:
              sum.push({
                icon: faCreativeCommons,
                rightsUri: r.rightsUri,
                rightsIdentifier: r.rightsIdentifier
              })
          }
        })
      }
      return sum
    }, [])

    const otherRights = uniqueRights.reduce((sum, r) => {
      let rightsIdentifier = r.rightsIdentifier
      if (rightsIdentifier && !rightsIdentifier.startsWith('cc')) {
        if (rightsIdentifier.startsWith('apache')) {
          rightsIdentifier = 'Apache%202.0'
        } else if (rightsIdentifier.startsWith('ogl')) {
          rightsIdentifier = 'OGL%20Canada'
        } else {
          rightsIdentifier = rightsIdentifier.replace(/-/g, '%20').toUpperCase()
        }
        sum.push(r)
      }
      return sum
    }, [])

    if (!ccRights[0] && !otherRights[0]) return ''

    return (
      <div className="license">
        {ccRights.map((r, index) => (
          <a href={r.rightsUri} key={index} target="_blank" rel="noreferrer">
            <FontAwesomeIcon key={r.rightsIdentifier} icon={r.icon} />
          </a>
        ))}
        {otherRights.map((r) => (
          <a
            href={r.rightsUri}
            key={r.rightsIdentifier}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={`https://img.shields.io/badge/license-${r.rightsIdentifier}-blue.svg`}
            />
          </a>
        ))}
      </div>
    )
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
    <Tooltip id="tooltipResourceTypeGeneral">
      The general type of the content.
    </Tooltip>
  )

  const tooltipFieldsOfScience = (
    <Tooltip id="tooltipFieldsOfScience">
      The OECD Fields of Science for the content.
    </Tooltip>
  )

  const tooltipLanguage = (
    <Tooltip id="tooltipLanguage">The primary language of the content.</Tooltip>
  )

  const tags = () => {
    return (
      <div className="tags">
        {metadata.types.resourceTypeGeneral && (
          <OverlayTrigger placement="top" overlay={tooltipResourceTypeGeneral}>
            <Label bsStyle="info">
              {startCase(metadata.types.resourceTypeGeneral)}
            </Label>
          </OverlayTrigger>
        )}
        {metadata.fieldsOfScience && (
          <span>
            {metadata.fieldsOfScience.map((fos) => (
              <OverlayTrigger
                key={fos.id}
                placement="top"
                overlay={tooltipFieldsOfScience}
              >
                <Label bsStyle="info">{fos.name}</Label>
              </OverlayTrigger>
            ))}
          </span>
        )}
        {metadata.language && (
          <OverlayTrigger placement="top" overlay={tooltipLanguage}>
            <Label bsStyle="info">{metadata.language.name}</Label>
          </OverlayTrigger>
        )}
      </div>
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
            <Pluralize
              singular={'Citation'}
              count={compactNumbers(metadata.citationCount)}
            />{' '}
          </span>
        )}
        {metadata.viewCount > 0 && (
          <span className="metrics-counter">
            <FontAwesomeIcon icon={faEye} size="sm" />{' '}
            <Pluralize
              singular={'View'}
              count={compactNumbers(metadata.viewCount)}
            />{' '}
          </span>
        )}
        {metadata.downloadCount > 0 && (
          <span className="metrics-counter">
            <FontAwesomeIcon icon={faDownload} size="sm" />{' '}
            <Pluralize
              singular={'Download'}
              count={compactNumbers(metadata.downloadCount)}
            />{' '}
          </span>
        )}
      </div>
    )
  }

  const footer = () => {
    const pageUrl =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
        ? 'https://commons.datacite.org/doi.org/' + metadata.doi
        : 'https://commons.stage.datacite.org/doi.org/' + metadata.doi

    const title = metadata.titles[0]
      ? 'DataCite Commons: ' + metadata.titles[0].title
      : 'DataCite Commons: No Title'

    return (
      <div className="panel-footer">
        <a href={handleUrl}>
          <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" /> {handleUrl}
        </a>
        <span className="actions">
          <EmailShareButton url={pageUrl} title={title}>
            <FontAwesomeIcon icon={faEnvelope} />
          </EmailShareButton>
        </span>
        <span className="actions">
          <TwitterShareButton url={pageUrl} title={title}>
            <FontAwesomeIcon icon={faTwitter} />
          </TwitterShareButton>
        </span>
        <span className="actions">
          <FacebookShareButton url={pageUrl} title={title}>
            <FontAwesomeIcon icon={faFacebook} />
          </FacebookShareButton>
        </span>
      </div>
    )
  }

  return (
    <div key={metadata.id} className="panel panel-transparent">
      <div className="panel-body">
        {title()}
        {creators()}
        {metadataTag()}
        {description()}
        {registered()}
        {license()}
        {metricsCounter()}
        {tags()}
      </div>
      {footer()}
    </div>
  )
}

export default WorkMetadata
