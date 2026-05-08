import React from 'react'
import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import { Claim } from 'src/data/types'
import DataCiteButton from 'src/components/DataCiteButton/DataCiteButton'
import { ACCENT_COLOR } from 'src/data/constants'

type Props = {
  claim: Claim,
  type: string
}

const ClaimStatus: React.FunctionComponent<Props> = ({ claim, type }) => {

  const stateColors = {
    done: 'success',
    failed: 'danger',
    working: ACCENT_COLOR,
    waiting: ACCENT_COLOR,
    ready: 'default',
    deleted: ACCENT_COLOR
  }
  const stateBadgeColors: Record<string, { backgroundColor: string, color?: string }> = {
    done: { backgroundColor: 'var(--bs-success)' },
    failed: { backgroundColor: 'var(--bs-danger)' },
    working: { backgroundColor: ACCENT_COLOR },
    waiting: { backgroundColor: ACCENT_COLOR },
    ready: { backgroundColor: 'var(--bs-secondary)' },
    deleted: { backgroundColor: ACCENT_COLOR }
  }
  const stateText = {
    ready: 'Unclaimed',
    done: 'Claimed',
    failed: 'Claim failed',
    working: 'Claim in progress',
    waiting: 'Claim waiting',
    deleted: 'Claim deleted'
  }

  const tooltipClaimStatus = (
    <Tooltip id="tooltipClaim">
      Status of claiming this DOI for your ORCID record.
    </Tooltip>
  )

  return (
    <>
      <OverlayTrigger placement="top" overlay={tooltipClaimStatus}>
        {type === 'button' ? (
          <DataCiteButton
            icon={faOrcid}
            color={stateColors[claim.state]}
            className='w-100'
            disabled
            outline
          >
            {stateText[claim.state]}
          </DataCiteButton>
        ) : (
          <Badge
            style={stateBadgeColors[claim.state] || { backgroundColor: 'var(--bs-secondary)' }}
          >
            <FontAwesomeIcon icon={faOrcid} /> {stateText[claim.state]}
          </Badge>
        )}
      </OverlayTrigger>
    </>
  )
}

export default ClaimStatus
