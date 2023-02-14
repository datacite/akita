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
      <h3 className="member-results" style={{ borderWidth: 0 }}>
        {organization.name}
        <a target="_blank" rel="noreferrer" href={organization.id} style={{fontSize: '0.82em', marginLeft: '1.5em'}}>{organization.id}</a>
        {organization.inceptionYear && <span className='inception-year'>Founded {organization.inceptionYear}</span>}
      </h3>
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
        </div>
      </div>
      <OrganizationMetadata metadata={organization} showTitle={false} />
    </>
  )
}

export default Organization 
