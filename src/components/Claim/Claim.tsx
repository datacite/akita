import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import startCase from 'lodash/startCase'

import { session } from '../../utils/session'
import { WorkType } from '../../pages/doi.org/[...doi]'

type Props = {
  doi: WorkType
}

const CLAIM_GQL = gql`
  mutation createClaim($doi: String, $sourceId: String) {
    claim {
      id
      state
      sourceId
      errorMessages {
        title
      }
    }
    errors {
      status
      source
      title
    }
  }
`

const Claim: React.FunctionComponent<Props> = ({ doi }) => {
  // don't show claim option if user is not logged in
  const user = session()
  if (!user) return null

  const [createClaim, { data }] = useMutation(CLAIM_GQL)

  const c = doi.claims[0] || { state: 'ready', sourceId: null }
  const isDone = c.state === 'done'
  const stateColors = {
    done: 'success',
    failed: 'danger',
    working: 'info',
    waiting: 'info',
    ready: 'default'
  }
  const stateText = {
    done: 'Claimed',
    failed: 'Claim failed',
    working: 'Claim in progress',
    waiting: 'Claim waiting',
    ready: 'Add to ORCID record'
  }
  const claimSources = {
    orcid_update: 'Auto-Update',
    orcid_search: 'Search and Link'
  }

  const tooltipClaim = (
    <Tooltip id="tooltipClaim">
      Status of claiming this DOI for your ORCID record.
    </Tooltip>
  )

  const onSubmit = () => {
    createClaim({
      variables: { doi: doi.doi, sourceId: 'orcid_search' }
    })
  }

  return (
    <>
      <h3 className="member-results">Claim</h3>
      <div className="panel panel-transparent claim">
        <div className="panel-body">
          <Row>
            <Col xs={6} md={4}>
              <OverlayTrigger placement="top" overlay={tooltipClaim}>
                <Button bsStyle={stateColors[c.state]} onClick={onSubmit}>
                  <FontAwesomeIcon icon={faOrcid} /> {stateText[c.state]}
                </Button>
              </OverlayTrigger>
            </Col>
            <Col xs={6} md={4}>
              {c.sourceId && (
                <>
                  <h5>Source</h5>
                  <a
                    href="https://support.datacite.org/docs/datacite-profiles-user-documentation#orcid-permissions"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {claimSources[c.sourceId]}
                  </a>
                </>
              )}
              {isDone && (
                <>
                  <h5>Claimed</h5>
                  {new Date(c.claimed).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </>
              )}
              {!isDone && c.errorMessages && c.errorMessages.length > 0 && (
                <>
                  <h5>Error Message</h5>
                  {startCase(c.errorMessages[0].title)}
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Claim
