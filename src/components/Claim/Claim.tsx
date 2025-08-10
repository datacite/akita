'use client'

import React from 'react'
import { useEffect } from 'react';
import { useMutation, ApolloCache } from '@apollo/client'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import { session, User } from 'src/utils/session'
import { Claim as ClaimType } from 'src/data/types'
import Error from 'src/components/Error/Error'
import ClaimStatus from 'src/components/ClaimStatus/ClaimStatus'
import { useGetClaimQuery, GET_CLAIM_GQL, CREATE_CLAIM_GQL, DELETE_CLAIM_GQL, QueryData, QueryVar } from 'src/data/queries/claimQuery';
import { ACCENT_GREEN, PROFILES_SETTINGS_URL, PROFILES_SIGN_IN_URL, WARNING } from 'src/data/constants';
import DataCiteButton from '../DataCiteButton/DataCiteButton';

type Props = {
  doi_id: string
}

const HELP_CONTENT = {
  'No user and/or ORCID token': <>Enable permissions in <a href={PROFILES_SETTINGS_URL} target='_blank'>Account Settings</a> to add this work to your ORCID record</>,
  // 'Too many claims. Only 10,000 claims allowed.': <></>,
  // 'Missing data': <></>,
  // 'token has expired.': <></>,
} as const

function getHelpContent(user: User, message?: string): React.ReactNode {
  if (!user) return <><a href={PROFILES_SIGN_IN_URL} target='_blank'>Sign in</a> to add this work to your ORCID record.</>
  if (!message) return null

  return HELP_CONTENT[message] || <>We encountered an error adding this work to your ORCID profile. Contact DataCite Support for help: <a href="mailto: support@datacite.org" target="_blank">support@datacite.org</a>. (Error code: {message})</>
}

export default function Claim({ doi_id }: Props) {

  const { loading, error, data, refetch } = useGetClaimQuery({ id: doi_id })

  const [claimError, setClaimError] = React.useState<string | null>(null);

  const addOrUpdateExistingClaim = (cache: ApolloCache<any>, updatedClaim: ClaimType) => {
    setClaimError(updatedClaim.errorMessages[0]?.title || null);

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
    return <DataCiteButton
      icon={faOrcid}
      color={ACCENT_GREEN}
      className='w-100'
      disabled
      outline
      title="Checking claim status..."
    >
      Checking claim status...
    </DataCiteButton>
  }

  if (error)
    return <Error title="Error fetching claim." message={error.message} />

  const errorMessage = claimError || (claim.errorMessages && claim.errorMessages.length > 0 ? claim.errorMessages[0].title : undefined)

  return (
    <>
      {isActionPossible ? (
        isClaimed ?
          <DataCiteButton
            onClick={onDelete}
            icon={faOrcid}
            color={WARNING}
            className='w-100'
            disabled={!user}
            outline
          >
            Remove Claim
          </DataCiteButton>
          :
          <DataCiteButton
            onClick={onCreate}
            icon={faOrcid}
            color={ACCENT_GREEN}
            className='w-100'
            disabled={!user}
            outline
          >
            Add to ORCID Record
          </DataCiteButton>
      ) :
        <ClaimStatus claim={claim} type="button" />
      }

      {!isClaimed &&
        <p className='secondary px-4 mt-2'>{getHelpContent(user, errorMessage)}</p>
      }
    </>
  )
}
