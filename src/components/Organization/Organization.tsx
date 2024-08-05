'use client'

import React from 'react'

import OrganizationMetadata from '../OrganizationMetadata/OrganizationMetadata'
import { Works } from 'src/data/types'
import { MetricsDisplay } from '../MetricsDisplay/MetricsDisplay'
import { Col, Row } from 'react-bootstrap-4'

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

export default function Organization({ organization }: Props) {

  return (
    <>
      <Row><Col>
        <MetricsDisplay
          counts={{ works: organization.works?.totalCount, citations: organization.citationCount, views: organization.viewCount, downloads: organization.downloadCount }}
          links={{
            citations: 'https://support.datacite.org/docs/citations-and-references',
            views: 'https://support.datacite.org/docs/views-and-downloads',
            downloads: 'https://support.datacite.org/docs/views-and-downloads'
          }}
        />
      </Col></Row>
      <Row className="mb-3"><Col>
        {organization.inceptionYear && 'Founded ' + organization.inceptionYear}
      </Col></Row>
      <Row><Col>
        <OrganizationMetadata metadata={organization} showTitle={false} />
      </Col></Row>
    </>
  )
}
