import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import OrganizationMetadata from 'src/components/OrganizationMetadata/OrganizationMetadata'
import { MetricsDisplay } from 'src/components/MetricsDisplay/MetricsDisplay'
import type { Organization as OrganizationType } from 'src/data/types'


type Props = {
  organization: OrganizationType
}

export default function Organization({ organization }: Props) {
  return <>
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
}
