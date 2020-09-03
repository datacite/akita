import React from 'react'
import Link from 'next/link'

import { FundingReference } from '../WorkContainer/WorkContainer'
import { doiFromUrl } from '../../utils/helpers'

type Props = {
  funding: FundingReference
}

const WorkFunding: React.FunctionComponent<Props> = ({ funding }) => {
  const funder = () => {
    if (
      funding.funderIdentifier &&
      funding.funderIdentifier.startsWith('https://doi.org/10.13039')
    )
      return (
        <h3 className="work">
          <Link
            href="/doi.org/[...doi]"
            as={`/doi.org${doiFromUrl(funding.funderIdentifier)}`}
          >
            <a>{funding.funderName}</a>
          </Link>
        </h3>
      )

    return <h3 className="work">{funding.funderName}</h3>
  }

  const hasAward = funding.awardTitle || funding.awardNumber || funding.awardUri

  const award = () => {
    let title = 'No award title or number'
    if (funding.awardTitle && funding.awardNumber) {
      title = funding.awardTitle + ' (' + funding.awardNumber + ')'
    } else if (funding.awardTitle) {
      title = funding.awardTitle
    } else if (funding.awardNumber) {
      title = funding.awardNumber
    }

    let url = null
    if (funding.awardUri && funding.awardUri.startsWith('http')) {
      url = funding.awardUri
    } else if (
      funding.awardUri &&
      funding.awardUri.startsWith('info:eu-repo/grantAgreement')
    ) {
      // provide url for EC funding
      url = 'https://cordis.europa.eu/project/id/' + funding.awardNumber
    }

    if (!url) return <div className="award">{title}</div>

    return (
      <div className="award">
        <a target="_blank" rel="noreferrer" href={url}>
          {title}
        </a>
      </div>
    )
  }

  return (
    <div className="panel-body">
      {funding.funderName && funder()}
      {hasAward && award()}
    </div>
  )
}

export default WorkFunding
