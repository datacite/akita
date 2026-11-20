'use client'

import React, { useEffect } from 'react'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faCheck, faRotateRight } from '@fortawesome/free-solid-svg-icons'

import { session, User } from 'src/utils/session'
import Error from 'src/components/Error/Error'
import {
  useClaimQuery,
  useCreateClaimMutation,
} from 'src/data/queries/claimQuery'
import { ACCENT_COLOR, ORCID_URL, PROFILES_SETTINGS_URL, PROFILES_SIGN_IN_URL } from 'src/data/constants'
import DataCiteButton from '../DataCiteButton/DataCiteButton'
import Link from 'next/link'
import { Spinner } from 'react-bootstrap'

type Props = {
  doi_id: string
}

// Only rendered for DataCite works; see doi.org Content.tsx registrationAgency guard.

const HELP_CONTENT = {
  'No user and/or ORCID token': <>Enable permissions in <a href={PROFILES_SETTINGS_URL} target='_blank' rel='noreferrer'>Account Settings</a> to add this work to your ORCID record</>,
} as const

function getHelpContent(user: User, message?: string): React.ReactNode {
  if (!user) return <><a href={PROFILES_SIGN_IN_URL} target='_blank' rel='noreferrer'>Sign in</a> to add this work to your ORCID record.</>
  if (!message) return null

  return HELP_CONTENT[message as keyof typeof HELP_CONTENT] || <>We encountered an error adding this work to your ORCID record. Contact DataCite Support for help: <a href="mailto: support@datacite.org" target='_blank' rel='noreferrer'>support@datacite.org</a>. (Error code: {message})</>
}

export default function Claim({ doi_id }: Props) {
  const user = session()
  const [claimError, setClaimError] = React.useState<string | number | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [claimUid, setClaimUid] = React.useState<string | null>(null)
  const { loading, error, data } = useClaimQuery({ id: doi_id, claimUid: claimUid, isSubmitting: isSubmitting })
  const { mutate: createClaim } = useCreateClaimMutation(doi_id)

  const claim = data?.claims[0]
  const state = claim?.state ?? 'ready'
  const isClaimed = state === 'done' && claim?.claimed != null
  const isActionPossible = state !== 'waiting' || isSubmitting

  const onMutationError = (error: Error) => {
    setClaimError(error.message)
    setIsSubmitting(false)
  }

  useEffect(() => {
    setClaimUid(claim?.id ?? null)
    if (claim?.state && claim?.state !== 'waiting') {
      setIsSubmitting(false)
      setClaimError(
        String(claim?.errorMessages?.[0]?.title ?? claim?.errorMessages?.[0]?.status ?? '') || null
      )
    }
  }, [claim?.id, claim?.state, claim?.claimed])

  const onCreate = () => {
    setIsSubmitting(true)
    createClaim(
      { doi: doi_id, sourceId: 'orcid_search' },
      {
        onSuccess: (result) => {
          setClaimError(result.claim?.errorMessages?.[0]?.title || null)
        },
        onError: onMutationError,
      }
    )
  }

  if (loading) {
    return (
      <DataCiteButton
        icon={faOrcid}
        color={ACCENT_COLOR}
        className='w-100'
        disabled
        outline
        title="Checking claim status..."
      >
        Checking ORCID Work Status...
      </DataCiteButton>
    )
  }

  if (error) {
    return <Error title="Error fetching claim." message={error.message} />
  }

  const errorMessage =
    claimError ||
    (claim?.errorMessages && claim.errorMessages.length > 0
      ? claim.errorMessages[0].title
      : undefined)

  return (
    <>
      {isActionPossible && isClaimed ? (
          <>
            <DataCiteButton
              icon={faCheck}
              color={ACCENT_COLOR}
              className='w-100'
              disabled={true}
              outline
            >
              Added to ORCID Record
            </DataCiteButton>
            <div className='d-flex flex-wrap justify-content-center align-items-center mt-2 small secondary'
              style={{rowGap: "0.5rem", columnGap: "1.5rem"}}>
              <Link
                href='#'
                onClick={(event) => {
                  event.preventDefault()
                  onCreate()
                }}
                className='secondary d-inline-flex align-items-center gap-1 flex-shrink-0 text-nowrap'
              >
                <FontAwesomeIcon icon={faRotateRight} size='xs' aria-hidden='true' />
                Re-Add Work
              </Link>
              <Link
                href={user ? `${ORCID_URL}/${user.uid}` : '#'}
                target='_blank'
                rel='noreferrer'
                className='secondary d-inline-flex align-items-center gap-1 flex-shrink-0 text-nowrap'
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size='xs' aria-hidden='true' />
                Manage in ORCID
              </Link>
            </div>
          </>
        ) : (
          <DataCiteButton
            onClick={onCreate}
            icon={isSubmitting ? undefined : faOrcid}
            color={ACCENT_COLOR}
            className='w-100'
            disabled={!user || isSubmitting}
            outline
          >
            { isSubmitting ? 
              <div className=' align-items-center gap-2'>
                <Spinner className='me-2' animation="border" size="sm" role="status" aria-hidden="true" />
                Adding to ORCID Record...
              </div>
              : 'Add to ORCID Record' }
          </DataCiteButton>
        )
      }

      {(!isClaimed || errorMessage) && (
        <p className='secondary px-4 mt-2 small'>{getHelpContent(user, String(errorMessage))}</p>
      )}
    </>
  )
}
