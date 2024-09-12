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
import lcCiOpen from './local-contexts/ci-open-to-collaborate.png'
import lctkNotice from './local-contexts/tk-notice.png'
import uniqBy from 'lodash/uniqBy'
import Image from 'next/image'

import styles from './License.module.scss'
import { Rights } from 'src/data/types'


type Props = {
  rights?: Rights[]
}

const localContexts2Icon= {
  'attribution-incomplete': lcCiAttribution,
  'open-to-collaborate': lcCiOpen,
  'bc-notice': lcBcNotice,
  'tk-notice': lctkNotice
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
  // const localContextRigths = uniqueRights.filter((r) => isLocalContexts(r))

  const localContextRigths = uniqueRights.reduce((sum, r) => {
    if (isLocalContexts(r)) {

      sum.push({
        icon: localContexts2Icon[r.rightsIdentifier],
        rightsUri: r.rightsUri,
        rightsIdentifier: r.rightsIdentifier
      })
    }
    return sum
  }, [] as { icon: any, rightsUri: string, rightsIdentifier: string }[])
  // })
  const ccRights = uniqueRights.reduce((sum, r) => {
    if (isCreativeCommons(r)) {
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
  }, [] as { icon: any, rightsUri: string, rightsIdentifier: string }[])

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

  if (!ccRights[0] && !otherRights[0]) return null

  return (
    <div className={'license ' + styles.licenses}>
      {ccRights.map((r, index) => (
        <a href={r.rightsUri} key={index} target="_blank" rel="noreferrer">
          <FontAwesomeIcon key={r.rightsIdentifier} icon={r.icon} className={styles.icons}/>
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
            // src={`https://img.shields.io/badge/license-MONKEY-green.svg`}
            src={r.icon}
            alt='License badge'
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


