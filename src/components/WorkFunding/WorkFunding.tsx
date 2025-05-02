import React from 'react'
import Link from 'next/link'

import { FundingReference } from 'src/data/types'
import { doiFromUrl, rorFromUrl } from '../../utils/helpers'

type Props = {
  funding: FundingReference
}

const WorkFunding: React.FunctionComponent<Props> = ({ funding }) => {
  const funderLink = (() => {
    if (!funding.funderIdentifier) return null
    try {
      const url = new URL(funding.funderIdentifier)
      if (url.host === 'doi.org' && url.pathname.startsWith('/10.13039')) {
        return '/doi.org' + doiFromUrl(funding.funderIdentifier)
      }
      if (url.host === 'ror.org') {
        return '/ror.org' + rorFromUrl(funding.funderIdentifier)
      }
    } catch (e) {
      return null
    }
    return null
  })()
  const showAwardLink = (
    funding.funderIdentifier &&
    funderLink &&
    funding.awardNumber
  )

  const funder = () => {    
    return funderLink ?
      <h4 className="work">
        <Link prefetch={false} href={funderLink}>
          {funding.funderName}
        </Link>
      </h4> : 
      <h4 className="work">{funding.funderName}</h4>
  }

  return (
    <>
      {funding.funderName && funder()}
      {funding.awardTitle && (
        <div className="award">{funding.awardTitle}</div>
      )}
      {showAwardLink && (
        <div className="award">
          <Link prefetch={false} href={funderLink && funderLink + '?filterQuery=fundingReferences.awardNumber:(' + funding.awardNumber + ')'}>
            {funding.awardNumber}
          </Link>
        </div>
      )}
    </>
  )
}

export default WorkFunding
