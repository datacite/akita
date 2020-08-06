import React from 'react'
import { OrganizationMetadata, OrganizationMetadataRecord } from '../OrganizationMetadata/OrganizationMetadata'

export interface OrganizationRecord {
  metadata: OrganizationMetadataRecord
}

type Props = {
  organization: OrganizationRecord
}

export const Organization: React.FunctionComponent<Props> = ({ organization }) => {
  return (
    <OrganizationMetadata metadata={organization.metadata} linkToExternal={true}></OrganizationMetadata>
  )
}
