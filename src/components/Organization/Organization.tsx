import React from 'react'

import OrganizationMetadata from '../OrganizationMetadata/OrganizationMetadata'
import { Works } from '../SearchWork/SearchWork'
import { MetricsDisplay } from '../MetricsDisplay/MetricsDisplay'

export interface OrganizationRecord {
  id: string
  name: string
  memberId: string
  memberRoleId: string
  alternateName: string[]
  inceptionYear: number
  url: string
  wikipediaUrl: string
  twitter: string
  types: string[]
  citationCount: number
  viewCount: number
  downloadCount: number
  country: {
    id: string
    name: string
  }
  geolocation: {
    pointLongitude: number
    pointLatitude: number
  }
  identifiers: {
    identifier: string
    identifierType: string
  }[]
  works?: Works
}

type Props = {
  organization: OrganizationRecord
}

const Organization: React.FunctionComponent<Props> = ({
  organization
}) => {

  return (
    <>
      <div className="panel panel-transparent aggregations">
        <div className="panel-body">
          <MetricsDisplay
            counts={{ works: organization.works.totalCount, citations: organization.citationCount, views: organization.viewCount, downloads: organization.downloadCount }}
            links={{
              citations: 'https://support.datacite.org/docs/citations-and-references',
              views: 'https://support.datacite.org/docs/views-and-downloads',
              downloads: 'https://support.datacite.org/docs/views-and-downloads'
            }}
            />
            {organization.inceptionYear && 'Founded '+ organization.inceptionYear}
        </div>
      </div>
      <OrganizationMetadata metadata={organization} showTitle={false} />
    </>
  )
}

export default Organization 
