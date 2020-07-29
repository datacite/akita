import * as React from 'react'
import { Popover, OverlayTrigger, Alert, Label, Tooltip } from 'react-bootstrap'
import startCase from 'lodash/startCase'
import truncate from 'lodash/truncate'
import uniqBy from 'lodash/uniqBy'
import Pluralize from 'react-pluralize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faQuoteLeft,
  faInfoCircle,
  faExternalLinkAlt,
  faDownload,
  faBookmark
} from '@fortawesome/free-solid-svg-icons'
import {
  faEye
} from '@fortawesome/free-regular-svg-icons'
import {
  faOrcid,
  faCreativeCommons,
  faCreativeCommonsBy,
  faCreativeCommonsNc,
  faCreativeCommonsNd,
  faCreativeCommonsSa,
  faCreativeCommonsZero
} from '@fortawesome/free-brands-svg-icons'
import ReactHtmlParser from 'react-html-parser'
import Link from 'next/link'
import { useRouter } from 'next/router'
// eslint-disable-next-line no-unused-vars
import { DoiType } from '../DoiContainer/DoiContainer'
import { compactNumbers, orcidFromUrl } from '../../utils/helpers'

type Props = {
  item: DoiType
}

const DoiMetadata: React.FunctionComponent<Props> = ({ item }) => {
  if (item == null) return (
    <Alert bsStyle="warning">
      No content found.
    </Alert>
  )

  const searchtitle = () => {
    if (!item.titles[0]) return (
      <h3 className="work">
        <Link href="/dois/[...doi]" as={`/dois/${(item.doi)}`}>
          <a>No Title</a>
        </Link>
      </h3>
    )

    const titleHtml = item.titles[0].title

    return (
      <h3 className="work">
        <Link href="/dois/[...doi]" as={`/dois/${(item.doi)}`}>
          <a>{ReactHtmlParser(titleHtml)}</a>
        </Link>
      </h3>
    )
  }

  const doiTitle = () => {
    if (!item.titles[0]) return (
      <h3 className="member">No Title</h3>
    )

    const titleHtml = item.titles[0].title

    return (
      <h3 className="work">
        <a target="_blank" rel="noreferrer" href={item.id}>
          {ReactHtmlParser(titleHtml)}
        </a>
      </h3>
    )
  }

  const title = () => {
    const router = useRouter()
    if (router == null || router.pathname === '/' || router.pathname === '/people/[person]') {
      return searchtitle()
    } else {
      return doiTitle()
    }
  }

  const creators = () => {
    if (!item.creators[0]) return (
      <div className="creators alert alert-warning">
        No creators
      </div>
    )

    const creatorList = item.creators.reduce((sum, creator, index, array) => {
      const c = creator.familyName ? [creator.givenName, creator.familyName].join(' ') : creator.name


      // padding depending on position in creators list
      switch (true) {
        case (array.length > index + 2):
          sum.push({ displayName: c + ', ', id: orcidFromUrl(creator.id) })
          break;
        case (array.length > index + 1):
          sum.push({ displayName: c + ' & ', id: orcidFromUrl(creator.id) })
          break;
        default:
          sum.push({ displayName: c, id: orcidFromUrl(creator.id) })
          break;
      }
      return sum
    }, [])

    return (
      <div className="creators">
        {creatorList.map((c, index) =>
          c.id !== null ? (
            <Link href="/people/[orcid]" key={index} as={`/people${(c.id)}`}>
              <a>{c.displayName}</a>
            </Link>
          ) : (
              c.displayName
            )
        )}
      </div>
    )
  }

  const metadata = () => {
    return (
      <div className="metadata">
        {item.version ? 'Version ' + item.version + ' of ' : ''}{item.types.resourceType ? startCase(item.types.resourceType) : 'Content'} published {item.publicationYear} via {item.publisher}
      </div>
    )
  }

  const description = () => {
    if (!item.descriptions[0]) return ''

    const descriptionHtml = truncate(item.descriptions[0].description, { 'length': 750, 'separator': '… ' })

    return (
      <div className="description">
        {ReactHtmlParser(descriptionHtml)}
      </div>
    )
  }

  const license = () => {
    let rights = [...item.rights];
    const uniqueRights = uniqBy(rights, 'rightsIdentifier')
    const ccRights = uniqueRights.reduce((sum, r) => {
      if (r.rightsIdentifier && r.rightsIdentifier.startsWith('cc')) {
        const splitIdentifier = r.rightsIdentifier.split('-').filter(l => ['cc', 'cc0', 'by', 'nc', 'nd', 'sa'].includes(l))
        splitIdentifier.forEach(l => {
          switch (l) {
            case 'by':
              sum.push({ icon: faCreativeCommonsBy, rightsUri: r.rightsUri, rightsIdentifier: r.rightsIdentifier })
              break;
            case 'nc':
              sum.push({ icon: faCreativeCommonsNc, rightsUri: r.rightsUri, rightsIdentifier: r.rightsIdentifier })
              break;
            case 'nd':
              sum.push({ icon: faCreativeCommonsNd, rightsUri: r.rightsUri, rightsIdentifier: r.rightsIdentifier })
              break;
            case 'sa':
              sum.push({ icon: faCreativeCommonsSa, rightsUri: r.rightsUri, rightsIdentifier: r.rightsIdentifier })
              break;
            case 'cc0':
              sum.push({ icon: faCreativeCommons, rightsUri: r.rightsUri, rightsIdentifier: r.rightsIdentifier })
              sum.push({ icon: faCreativeCommonsZero, rightsUri: r.rightsUri, rightsIdentifier: r.rightsIdentifier })
              break;
            default:
              sum.push({ icon: faCreativeCommons, rightsUri: r.rightsUri, rightsIdentifier: r.rightsIdentifier })
          }
        })
      }
      return sum
    }, [])

    const otherRights = uniqueRights.reduce((sum, r) => {
      let rightsIdentifier = r.rightsIdentifier;
      if (rightsIdentifier && !rightsIdentifier.startsWith('cc')) {
        if (rightsIdentifier.startsWith('apache')) {
          rightsIdentifier = "Apache%202.0"
        } else if (rightsIdentifier.startsWith('ogl')) {
          rightsIdentifier = "OGL%20Canada"
        } else {
          rightsIdentifier = rightsIdentifier.replace(/-/g, '%20').toUpperCase();
        }
        sum.push(r)
      }
      return sum
    }, [])

    if (!ccRights[0] && !otherRights[0]) return ''

    return (
      <div className="license">
        {ccRights.map((r, index) =>
          <a href={r.rightsUri} key={index} target="_blank" rel="noreferrer">
            <FontAwesomeIcon key={r.rightsIdentifier} icon={r.icon} />
          </a>
        )}
        {otherRights.map((r) =>
          <a href={r.rightsUri} key={r.rightsIdentifier} target="_blank" rel="noreferrer">
            <img src={`https://img.shields.io/badge/license-${r.rightsIdentifier}-blue.svg`} />
          </a>
        )}
      </div>
    )
  }

  const registered = () => {
    return (
      <div className="registered">
        DOI registered
        {item.registered &&
          <span> {new Date(item.registered).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        } via {item.registrationAgency.name}.
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
    <Tooltip id="tooltipLanguage">
      The primary language of the content.
    </Tooltip>
  )

  const tags = () => {
    return (
      <div className="tags">
        {item.types.resourceTypeGeneral &&
          <OverlayTrigger placement="top" overlay={tooltipResourceTypeGeneral}>
            <Label bsStyle="info">{startCase(item.types.resourceTypeGeneral)}</Label>
          </OverlayTrigger>
        }
        {item.fieldsOfScience &&
          <span>
            {item.fieldsOfScience.map(fos => (
              <OverlayTrigger key={fos.id} placement="top" overlay={tooltipFieldsOfScience}>
                <Label bsStyle="info">{fos.name}</Label>
              </OverlayTrigger>
            ))}
          </span>
        }
        {item.language &&
          <OverlayTrigger placement="top" overlay={tooltipLanguage}>
            <Label bsStyle="info">{item.language.name}</Label>
          </OverlayTrigger>
        }
      </div>
    )
  }

  const metricsCounter = () => {
    if (item.citationCount + item.viewCount + item.downloadCount == 0) {
      return (
        <div className="metrics-counter">
          <i><FontAwesomeIcon icon={faInfoCircle} /> No citations, views or downloads reported.</i>
        </div>
      )
    }

    return (
      <div className="metrics-counter">
        {item.citationCount > 0 &&
          <i><FontAwesomeIcon icon={faQuoteLeft} /> <Pluralize singular={'Citation'} count={compactNumbers(item.citationCount)} /> </i>
        }
        {item.viewCount > 0 &&
          <i><FontAwesomeIcon icon={faEye} /> <Pluralize singular={'View'} count={compactNumbers(item.viewCount)} /> </i>
        }
        {item.downloadCount > 0 &&
          <i><FontAwesomeIcon icon={faDownload} /> <Pluralize singular={'Download'} count={compactNumbers(item.downloadCount)} /> </i>
        }
      </div>
    )
  }

  const bookmark = (
    <Popover id="bookmark" title="Bookmarking">
      Bookmarking on this site will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const claim = (
    <Popover id="claim" title="Claim to ORCID Record">
      Claiming to an ORCID record will be implemented later in 2020. <a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input</a>
    </Popover>
  )

  const links = () => {
    return (
      <div className="panel-footer">
        <a href={item.id}><FontAwesomeIcon icon={faExternalLinkAlt} /> {item.id}</a>
        <span className="actions">
          <OverlayTrigger trigger="click" placement="top" overlay={bookmark}>
            <span className="bookmark"><FontAwesomeIcon icon={faBookmark} /> Bookmark</span>
          </OverlayTrigger>
          <OverlayTrigger trigger="click" placement="top" overlay={claim}>
            <span className="claim"><FontAwesomeIcon icon={faOrcid} /> Claim</span>
          </OverlayTrigger>
        </span>
      </div>
    )
  }

  return (
    <div key={item.id} className="panel panel-transparent content-item">
      <div className="panel-body">
        {title()}

        {creators()}
        {metadata()}
        {description()}
        {registered()}
        {license()}
        {metricsCounter()}
        {tags()}
      </div>
      {links()}
      <br />
    </div>
  )
}

export default DoiMetadata
