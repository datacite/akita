import React from 'react'
import Link from 'next/link'

import { FundingReference } from 'src/data/types'
import { doiFromUrl } from '../../utils/helpers'

type Props = {
  funding: FundingReference
}

const WorkFunding: React.FunctionComponent<Props> = ({ funding }) => {
  const showAwardLink = funding.funderIdentifier &&
    funding.funderIdentifier.startsWith('https://doi.org/10.13039') &&
    funding.awardNumber

  const funder = () => {
    if (
      funding.funderIdentifier &&
      funding.funderIdentifier.startsWith('https://doi.org/10.13039')
    )
      return (
        <h4 className="work">
          <Link href={'/doi.org' + doiFromUrl(funding.funderIdentifier)}>
            {funding.funderName}
          </Link>
        </h4>
      )

    return <h4 className="work">{funding.funderName}</h4>
  }

  return (
    <>
      {funding.funderName && funder()}
      {funding.awardTitle && (
        <div className="award">{funding.awardTitle}</div>
      )}
      {showAwardLink && (
        <div className="award">
          <Link href={'/doi.org' + doiFromUrl(funding.funderIdentifier || '') + '?query=fundingReferences.awardNumber:(' + funding.awardNumber + ')'}>
            {funding.awardNumber}
          </Link>
        </div>
      )}
    </>
  )
}

export default WorkFunding
