import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Organization as OrganizationType } from 'src/data/types'
import { fetchOrganization } from 'src/data/queries/organizationQuery';

import Error from 'src/components/Error/Error'
import Title from 'src/components/Title/Title'
import DownloadReports from 'src/components/DownloadReports/DownloadReports'
import ShareLinks from 'src/components/ShareLinks/ShareLinks'
import Organization from 'src/components/Organization/Organization'
import { rorFromUrl } from 'src/utils/helpers'

interface Props {
  rorid: string
  isBot?: boolean
}

export default async function Content(props: Props) {
  const { rorid, isBot = false } = props

  const { data, error } = await fetchOrganization(rorid)

  if (error) return (
    <Col md={{ span: 9, offset: 3 }}>
      <Error title="An error occured." message={error.message} />
    </Col>
  )

  const organization = data?.organization || {} as OrganizationType


  return (
    <Container fluid>
      <Row className="mb-4">
        <Col md={{ offset: 3 }}>
          <Title title={organization.name} titleLink={organization.id} link={organization.id} />
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          {!isBot && <DownloadReports
            links={[
              {
                title: 'Related Works (CSV)',
                helpText: 'Includes descriptions and formatted citations in APA style for up to 200 DOIs associated with this organization.',
                type: 'ror/related-works',
              },
              {
                title: 'Funders (CSV)',
                helpText: 'Includes up to 200 funders associated with related works.',
                type: 'ror/funders',
              }
            ]}
            variables={{ id: rorid }}
          />}
          <ShareLinks url={'ror.org' + rorFromUrl(organization.id)} title={organization.name} />
        </Col>
        <Col md={9} className="px-0">
          <Organization organization={organization} />
        </Col>
      </Row>
    </Container>
  )
}
