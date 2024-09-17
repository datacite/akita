import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import {
  faCreativeCommons,
  faCreativeCommonsBy,
  faCreativeCommonsNc,
  faCreativeCommonsNd,
  faCreativeCommonsSa,
  faCreativeCommonsZero
} from '@fortawesome/free-brands-svg-icons'
import lcBcNotice from './local-contexts/bc-notice.png'
import lcCiAttribution from './local-contexts/ci-attribution-incomplete.png'
import lcTkNotice from './local-contexts/tk-notice.png'
import uniqBy from 'lodash/uniqBy'
import Image from 'next/image'

import styles from './License.module.scss'
import { Rights } from 'src/data/types'


type Props = {
  rights?: Rights[]
}

const cc2Icon = {
  'cc': { icon: faCreativeCommons, alt: 'Creative Commons' },
  'cc0': { icon: faCreativeCommonsZero, alt: 'Creative Commons Zero (Public Domain Dedication)' },
  'by': { icon: faCreativeCommonsBy, alt: 'Creative Commons Attribution' },
  'nc': { icon: faCreativeCommonsNc, alt: 'Creative Commons Non-Commercial' },
  'nd': { icon: faCreativeCommonsNd, alt: 'Creative Commons No Derivatives' },
  'sa': { icon: faCreativeCommonsSa, alt: 'Creative Commons Share Alike' }
}
const ccKeys = Object.keys(cc2Icon)

const localContexts2Icon= {
  'attribution-incomplete': { icon: lcCiAttribution, alt: 'Attribution Incomplete Notice' },
  'bc-notice': { icon: lcBcNotice, alt: 'Biocultural (BC) Notice' },
  'tk-notice': { icon: lcTkNotice, alt: 'Traditional Knowledge Notice' }
}
const localContextsKeys = Object.keys(localContexts2Icon)

function isCreativeCommons( rights: Rights ) {
  return rights.rightsIdentifier && rights.rightsIdentifier.startsWith('cc')
}

function isLocalContexts( rights: Rights ) {
  return rights.rightsIdentifier && rights.rightsIdentifierScheme == "Local Contexts" && localContextsKeys.includes(rights.rightsIdentifier)
}

export const License: React.FunctionComponent<Props> = ({ rights = [] }) => {

  const uniqueRights = uniqBy([...rights], 'rightsIdentifier')

  const localContextRigths = uniqueRights.reduce((sum, r) => {
    if (isLocalContexts(r)) {
      const localContext = localContexts2Icon[r.rightsIdentifier]

      sum.push({
        icon: localContext.icon,
        altText: localContext.alt,
        rightsUri: r.rightsUri,
        rightsIdentifier: r.rightsIdentifier
      })
    }
    return sum
  }, [] as { icon: any, rightsUri: string, altText: string, rightsIdentifier: string }[])

  const ccRights = uniqueRights.reduce((sum, r) => {
    if (isCreativeCommons(r)) {
      const splitIdentifier = r.rightsIdentifier
        .split('-')
        .filter((l) => ccKeys.includes(l))
      splitIdentifier.forEach((l) => {
        if (l == 'cc0') {
          sum.push({
            icon: faCreativeCommons,
            rightsUri: r.rightsUri,
            rightsIdentifier: r.rightsIdentifier,
            altText: 'Creative Commons'
          })
        }
        const ccSelected = cc2Icon[l]
        sum.push({
              icon: ccSelected.icon,
              rightsUri: r.rightsUri,
              rightsIdentifier: r.rightsIdentifier,
              altText: ccSelected.alt
        })
      })
    }
    return sum
  }, [] as { icon: any, rightsUri: string, altText: string, rightsIdentifier: string }[])

  const otherRights = uniqueRights.reduce((sum, r) => {
    const ri = { rightsIdentifier: '' }
    if (r.rightsIdentifier && !isCreativeCommons(r) && !isLocalContexts(r)) {
      if (r.rightsIdentifier.startsWith('apache')) {
        ri.rightsIdentifier = 'Apache%202.0'
      } else if (r.rightsIdentifier.startsWith('ogl')) {
        ri.rightsIdentifier = 'OGL%20Canada'
      } else {
        ri.rightsIdentifier = r.rightsIdentifier
          .replace(/-/g, '%20')
          .toUpperCase()
      }
      sum.push(ri)
    }
    return sum
  }, [] as { rightsIdentifier: string }[])

  if (!ccRights[0] && !otherRights[0] && !localContextRigths[0]) return null

  return (
    <div className={'license ' + styles.licenses}>
      {ccRights.map((r, index) => (
        <a href={r.rightsUri} key={index} target="_blank" rel="noreferrer">
        <FontAwesomeIcon
          key={r.rightsIdentifier}
          icon={r.icon}
          className={styles.icons}
          title={r.altText}
        />
        </a>
      ))}
      {localContextRigths.map((r) => (
        <a
          href={r.rightsUri}
          key={r.rightsIdentifier}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src={r.icon}
            alt={r.altText}
            className={styles.icons}
            width={32}
          />
        </a>
      ))}
      {otherRights.map((r) => (
        <a
          // href={r.rightsUri}
          key={r.rightsIdentifier}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={`https://img.shields.io/badge/license-${r.rightsIdentifier}-blue.svg`}
            alt='License badge'
          />
        </a>
      ))}
    </div>
  )
}


