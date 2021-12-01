import React from 'react'
import { useRef, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client'
import { Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import { session } from '../../utils/session'
import { ClaimType } from '../../pages/doi.org/[...doi]'
import Loading from '../Loading/Loading'
import Error from '../Error/Error'
import ClaimStatus from '../ClaimStatus/ClaimStatus'
import { Feature } from 'flagged'

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

  const intervalRef = useRef(null);

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

  // Start interval to refresh claim status
  useEffect(() => {

    if (claim.state === 'waiting') {
      intervalRef.current = setInterval(() => {
        refetch()
      }, 1000);
    } else {
      return () => clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [claim])

  const onCreate = () => {
    createClaim({
      variables: { doi: doi_id, sourceId: 'orcid_search' }
    })
  }

  const onDelete = () => {
    deleteClaim({
      variables: { id: claim.id }
    })
  }

  return (
    <>
      <Feature name="orcidclaiming">
      <h3 className="member-results">ORCID Claim</h3>
      <div className="panel panel-transparent claim"></div>
      <div className="panel-body">
        <Row>
            <Col xs={6} md={4}>
            {isActionPossible ? (
              <>
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
            ) : <ClaimStatus claim={claim} />
            }

            {!isClaimed && claim.errorMessages && claim.errorMessages.length > 0 && (
              <>
                <h5>Error</h5>
                {claim.errorMessages[0].title}
              </>
            )}

          </Col>
        </Row>
      </div>
      </Feature>
    </>
  )
}

export default Claim
