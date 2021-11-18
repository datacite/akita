import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import startCase from 'lodash/startCase'

import { session } from '../../utils/session'
import { WorkType, ClaimType } from '../../pages/doi.org/[...doi]'
import Loading from '../Loading/Loading'
import Error from '../Error/Error'

type Props = {
  doi: WorkType
}

const CREATE_CLAIM_GQL = gql`
  mutation createClaim($doi: ID!, $sourceId: String!) {
    createClaim(doi: $doi, sourceId: $sourceId) {
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
  }
`

const DELETE_CLAIM_GQL = gql`
  mutation deleteClaim($id: ID!) {
    deleteClaim(id: $id) {
      message
      errors {
        status
        title
      }
    }
  }
`

const Claim: React.FunctionComponent<Props> = ({ doi }) => {
  // don't show claim option if user is not logged in
  // don't show claim option if user is not staff_admin
  // don't show claim option if registration agency is not datacite
  const user = session()
  if (
    !user ||
    (doi.registrationAgency && doi.registrationAgency.id !== 'datacite')
  )
    return null

  const [createClaim, { loading, error }] = useMutation(CREATE_CLAIM_GQL, {
    errorPolicy: 'all'
  })
  const [deleteClaim] = useMutation(DELETE_CLAIM_GQL, {
    errorPolicy: 'all'
  })
  if (loading) return <Loading />
  if (error)
    return (
      <>
        <h3 className="member-results">Claim</h3>
        <div className="panel panel-transparent claim">
          <div className="panel-body">
            <Error title="An error occured." message={error.message} />
          </div>
        </div>
      </>
    )

  const c: ClaimType = doi.claims[0] || {
    id: null,
    sourceId: null,
    state: 'ready',
    claimAction: null,
    claimed: null,
    errorMessages: null
  }
  const isDone = c.state === 'done' && c.claimed != null
  const stateColors = {
    done: 'warning',
    failed: 'danger',
    working: 'info',
    waiting: 'info',
    ready: 'default',
    deleted: 'warning'
  }
  const stateText = {
    done: 'Delete Claim',
    failed: 'Claim failed',
    working: 'Claim in progress',
    waiting: 'Claim waiting',
    ready: 'Add to ORCID record',
    deleted: 'Add to ORCID record'
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

  const onCreate = () => {
    createClaim({
      variables: { doi: doi.doi, sourceId: 'orcid_search' }
    })
  }
  const onDelete = () => {
    deleteClaim({
      variables: { id: doi.claims[0].id }
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
                <Button
                  bsStyle={stateColors[c.state]}
                  className="claim"
                  onClick={isDone ? onDelete : onCreate}
                >
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
