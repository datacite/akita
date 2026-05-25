'use client'

import React from 'react'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import { session, User } from 'src/utils/session'
import Error from 'src/components/Error/Error'
import ClaimStatus from 'src/components/ClaimStatus/ClaimStatus'
import {
  useClaimQuery,
  useCreateClaimMutation,
  useDeleteClaimMutation,
} from 'src/data/queries/claimQuery'
import { ACCENT_COLOR, PROFILES_SETTINGS_URL, PROFILES_SIGN_IN_URL, WARNING } from 'src/data/constants'
import DataCiteButton from '../DataCiteButton/DataCiteButton'

type Props = {
  doi_id: string
}

const HELP_CONTENT = {
  'No user and/or ORCID token': <>Enable permissions in <a href={PROFILES_SETTINGS_URL} target='_blank' rel='noreferrer'>Account Settings</a> to add this work to your ORCID record</>,
} as const

function getHelpContent(user: User, message?: string): React.ReactNode {
  if (!user) return <><a href={PROFILES_SIGN_IN_URL} target='_blank' rel='noreferrer'>Sign in</a> to add this work to your ORCID record.</>
  if (!message) return null

  return HELP_CONTENT[message as keyof typeof HELP_CONTENT] || <>We encountered an error adding this work to your ORCID profile. Contact DataCite Support for help: <a href="mailto: support@datacite.org" target='_blank' rel='noreferrer'>support@datacite.org</a>. (Error code: {message})</>
}

export default function Claim({ doi_id }: Props) {
  const user = session()
  const [claimError, setClaimError] = React.useState<string | null>(null)

  const { loading, error, data } = useClaimQuery({ id: doi_id })
  const { mutate: createClaim, isPending: isCreating } = useCreateClaimMutation(doi_id)
  const { mutate: deleteClaim, isPending: isDeleting } = useDeleteClaimMutation(doi_id)
  const isSubmitting = isCreating || isDeleting

  const claim = data?.work.claims[0]
  const state = claim?.state ?? 'ready'
  const isClaimed = state === 'done' && claim?.claimed != null
  const isActionPossible = state !== 'waiting'

  const onCreate = () => {
    createClaim(
      { doi: doi_id, sourceId: 'orcid_search' },
      {
        onSuccess: (result) => {
          setClaimError(result.claim?.errorMessages?.[0]?.title || null)
        },
      }
    )
  }

  const onDelete = () => {
    if (!claim?.id) return

    deleteClaim(claim.id, {
      onSuccess: (result) => {
        setClaimError(result.claim?.errorMessages?.[0]?.title || null)
      },
    })
  }

  if (data?.work.registrationAgency && data.work.registrationAgency.id !== 'datacite') {
    return null
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
        Checking claim status...
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
      {isActionPossible ? (
        isClaimed ? (
          <DataCiteButton
            onClick={onDelete}
            icon={faOrcid}
            color={WARNING}
            className='w-100'
            disabled={!user || isSubmitting}
            outline
          >
            Remove Claim
          </DataCiteButton>
        ) : (
          <DataCiteButton
            onClick={onCreate}
            icon={faOrcid}
            color={ACCENT_COLOR}
            className='w-100'
            disabled={!user || isSubmitting}
            outline
          >
            Add to ORCID Record
          </DataCiteButton>
        )
      ) : (
        claim && <ClaimStatus claim={claim} type="button" />
      )}

      {!isClaimed && (
        <p className='secondary px-4 mt-2'>{getHelpContent(user, errorMessage)}</p>
      )}
    </>
  )
}
