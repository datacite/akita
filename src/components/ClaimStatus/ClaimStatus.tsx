import React from 'react'
import { Button, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import { Claim } from 'src/data/types'

type Props = {
  claim: Claim,
  type: string
}

const ClaimStatus: React.FunctionComponent<Props> = ({ claim, type }) => {

  const stateColors = {
    done: 'success',
    failed: 'danger',
    working: 'info',
    waiting: 'info',
    ready: 'default',
    deleted: 'info'
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
          <Button disabled variant={stateColors[claim.state]}>
            <FontAwesomeIcon icon={faOrcid} /> {stateText[claim.state]}
          </Button>
        ) : (
          <Badge bg={stateColors[claim.state]}>
            <FontAwesomeIcon icon={faOrcid} /> {stateText[claim.state]}
          </Badge>
        )}
      </OverlayTrigger>
    </>
  )
}

export default ClaimStatus
