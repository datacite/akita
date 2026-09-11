import React from 'react'

import { Person as PersonType } from 'src/data/types'
import { fetchPerson } from 'src/data/queries/personQuery'

import Error from 'src/components/Error/Error'
import Person from 'src/components/Person/Person'
import CommonsLayout from 'src/components/CommonsLayout/CommonsLayout'

interface Props {
  orcid: string
  isBot?: boolean
}

export default async function Content(props: Props) {
  const { orcid } = props

  const { data, error } = await fetchPerson(orcid)

  if (error)
    return (
      <CommonsLayout>
        <Error title="An error occured." message={error.message} />
      </CommonsLayout>
    )

  const person = data?.person || ({} as PersonType)

  return (
    <CommonsLayout>
      <Person person={person} />
    </CommonsLayout>
  )
}
