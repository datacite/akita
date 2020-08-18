import React from 'react'
import {
  OrganizationMetadata
} from '../OrganizationMetadata/OrganizationMetadata'

export interface OrganizationRecord {
  id: string
  name: string
  alternateName: string[]
  url: string
  wikipediaUrl: string
  types: string[]
  address: {
    country: string
  }
  identifiers: {
    identifier: string
    identifierType: string
  }[]
}

type Props = {
  organization: OrganizationRecord
}

export const Organization: React.FunctionComponent<Props> = ({
  organization
}) => {
  return (
    <OrganizationMetadata
      metadata={organization}
      linkToExternal={true}
    ></OrganizationMetadata>
  )
}
