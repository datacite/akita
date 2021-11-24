import React from 'react'
import { OverlayTrigger, Tooltip, Label } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import { ClaimType } from '../../pages/doi.org/[...doi]'

type Props = {
    claim: ClaimType
}

const ClaimStatus: React.FunctionComponent<Props> = ({ claim }) => {

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
                <Label bsStyle={stateColors[claim.state]}>
                    <FontAwesomeIcon icon={faOrcid} /> {stateText[claim.state]}
                </Label>
            </OverlayTrigger>
        </>
    )
}

export default ClaimStatus
