'use client'

import React from 'react'
import { useEffect } from 'react';
import { useMutation, ApolloCache } from '@apollo/client'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import { session } from 'src/utils/session'
import { Claim as ClaimType } from 'src/data/types'
import Error from 'src/components/Error/Error'
import ClaimStatus from 'src/components/ClaimStatus/ClaimStatus'
import styles from './Claim.module.scss'
import { useGetClaimQuery, GET_CLAIM_GQL, CREATE_CLAIM_GQL, DELETE_CLAIM_GQL, QueryData, QueryVar } from 'src/data/queries/claimQuery';

type Props = {
  doi_id: string
}


export default function Claim({ doi_id }: Props) {

  const { loading, error, data, refetch } = useGetClaimQuery({ id: doi_id })

  const addOrUpdateExistingClaim = (cache: ApolloCache<any>, updatedClaim: ClaimType) => {
    const existingClaims = cache.readQuery<QueryData, QueryVar>({ query: GET_CLAIM_GQL, variables: { id: doi_id } });

    // Add or update the claim in the cache
    let newClaims: ClaimType[] = [];
    if (existingClaims && existingClaims.work && existingClaims.work.claims.length > 0) {
      // Update existing claims with new claim
      const existingClaimsUpdated = existingClaims.work.claims.map(claim => {
        if (claim.id === updatedClaim.id) {
          return updatedClaim;
        }
        return claim;
      });

      newClaims = existingClaimsUpdated;

    } else {
      newClaims = existingClaims ? [...existingClaims.work.claims, updatedClaim] : [updatedClaim];
    }

    cache.writeQuery({ query: GET_CLAIM_GQL, variables: { id: doi_id }, data: { work: { ...existingClaims?.work, claims: newClaims } } });
  }

  const [createClaim] = useMutation(CREATE_CLAIM_GQL, {
    errorPolicy: 'all',
    update(cache, { data: { createClaim } }) {
      if (createClaim.claim) {
        addOrUpdateExistingClaim(cache, createClaim.claim);
      }
    }
  })

  const [deleteClaim] = useMutation(DELETE_CLAIM_GQL, {
    errorPolicy: 'all',
    update(cache, { data: { deleteClaim } }) {
      if (deleteClaim.claim) {
        addOrUpdateExistingClaim(cache, deleteClaim.claim);
      }
    }
  })

  const user = session()

  const claim: ClaimType = data?.work.claims[0] || {
    id: null,
    sourceId: null,
    state: 'ready',
    claimAction: null,
    claimed: null,
    errorMessages: null
  } as any

  const isClaimed = claim.state === 'done' && claim.claimed != null
  const isActionPossible = claim.state !== 'waiting'

  useEffect(() => {
    if (!isActionPossible) {
      const timer = setInterval(() => {
        refetch()
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [isActionPossible])


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



  // don't show claim option if registration agency is not datacite
  if (data?.work.registrationAgency && data.work.registrationAgency.id !== 'datacite')
    return null

  if (loading) {
    return <Button variant='warning' className={styles.claimWarning} disabled title="Checking claim status...">
      Checking claim status...
    </Button>
  }

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
  if (!user) {
    return <Button variant='primary' className={styles.claimDisabled} disabled title="Sign in to Add to ORCID record">
      <FontAwesomeIcon icon={faOrcid} /> Add to ORCID Record
    </Button>
  }

  return (
    <>
      {isActionPossible ? (
        <>
          {isClaimed ?
            <Button
              variant={'warning'}
              onClick={onDelete}
              className='w-100'
            >
              <FontAwesomeIcon icon={faOrcid} /> Remove Claim
            </Button>
            :
            <Button
              variant='primary'
              onClick={onCreate}
              className='w-100'
            >
              <FontAwesomeIcon icon={faOrcid} /> Add to ORCID Record
            </Button>
          }
        </>
      ) : <ClaimStatus claim={claim} type="button" />
      }

      {!isClaimed && claim.errorMessages && claim.errorMessages.length > 0 && (
        <>
          <p>Error: {claim.errorMessages[0].title}</p>
        </>
      )}
    </>
  )
}
