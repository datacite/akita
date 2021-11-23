import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import { session } from '../../utils/session'
import { ClaimType } from '../../pages/doi.org/[...doi]'
import Loading from '../Loading/Loading'
import Error from '../Error/Error'
import ClaimStatus from '../ClaimStatus/ClaimStatus'

type Props = {
  doi_id: string
}

interface QueryData {
  work: {
    id
    registrationAgency: {
      id: string
    }
    claims: ClaimType[]
  }
}

interface QueryVar {
  id: string
}

const GET_CLAIM_GQL = gql`
query getDoiClaimQuery(
  $id: ID!
) {
  work(id: $id) {
    id
    registrationAgency {
      id
    }
    claims {
      id
      sourceId
      state
      claimAction
      claimed
      errorMessages {
        status
        title
      }
    }
  }
}
`

const CREATE_CLAIM_GQL = gql`
  mutation createClaim($doi: ID!, $sourceId: String!) {
    createClaim(doi: $doi, sourceId: $sourceId) {
      claim {
        id
        sourceId
        state
        claimAction
        claimed
        errorMessages {
          status
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
      claim {
        id
        sourceId
        state
        claimAction
        claimed
        errorMessages {
          status
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

const Claim: React.FunctionComponent<Props> = ({ doi_id }) => {

  const { loading, error, data, refetch } = useQuery<QueryData, QueryVar>(GET_CLAIM_GQL, {
    fetchPolicy: "network-only",
    errorPolicy: 'all',
    variables: {
      id: doi_id,
    }
  })

  const [createClaim] = useMutation(CREATE_CLAIM_GQL, {
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

  // don't show claim option if user is not logged in
  // don't show claim option if user is not staff_admin
  // don't show claim option if registration agency is not datacite
  const user = session()
  if (
    !user ||
    (data.work.registrationAgency && data.work.registrationAgency.id !== 'datacite')
  )
    return null

  const claim: ClaimType = data.work.claims[0] || {
    id: null,
    sourceId: null,
    state: 'ready',
    claimAction: null,
    claimed: null,
    errorMessages: null
  }

  const isClaimed = claim.state === 'done' && claim.claimed != null
  const isActionPossible = claim.state !== 'waiting'

  const claimSources = {
    orcid_update: 'Auto-Update',
    orcid_search: 'Search and Link'
  }

  const checkForStatusUpdate = () => {
    const timer = setTimeout(() => {
      console.log("refetch")
      refetch()
    }, 5000);
    return () => clearTimeout(timer);
  }

  const onCreate = () => {
    createClaim({
      variables: { doi: doi_id, sourceId: 'orcid_search' }
    })

    checkForStatusUpdate()
  }

  const onDelete = () => {
    deleteClaim({
      variables: { id: claim.id }
    })

    checkForStatusUpdate()
  }

  return (
    <>
      <h3 className="member-results">ORCID Claim</h3>
      <div className="panel panel-transparent claim"></div>
      <div className="panel-body">
        <Row>
          <Col xs={6} md={4}>
            <h5>Claim Status</h5>
            <ClaimStatus claim={claim} />

            {claim.sourceId && (
                <>
                  <h5>Source</h5>
                  <a
                    href="https://support.datacite.org/docs/datacite-profiles-user-documentation#orcid-permissions"
                    target="_blank"
                    rel="noreferrer"
                  >
                  {claimSources[claim.sourceId]}
                  </a>
                </>
              )}
            {isClaimed && (
              <>
                <h5>Claimed</h5>
                {new Date(claim.claimed).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </>
            )}

          </Col>
          <Col xs={6} md={4}>
            {isActionPossible && (
              <>
                <h5>Actions</h5>
                {isClaimed ?
                  <Button
                    bsStyle={'warning'}
                    className="claim"
                    onClick={onDelete}
                  >
                    <FontAwesomeIcon icon={faOrcid} /> Remove Claim
                  </Button>
                  :
                  <Button
                    bsStyle={'info'}
                    className="claim"
                    onClick={onCreate}
                  >
                    <FontAwesomeIcon icon={faOrcid} /> Claim DOI
                  </Button>
                }
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Claim
