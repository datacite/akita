'use client'
import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import type { MinimalOrganization as OrganizationType } from 'src/data/queries/searchOrganizationQuery'
import { useROROrganization } from 'src/data/queries/searchOrganizationQuery';

import Error from 'src/components/Error/Error'
import Title from 'src/components/Title/Title'
import DownloadReports from 'src/components/DownloadReports/DownloadReports'
import OrganizationMetadata from 'src/components/OrganizationMetadata/OrganizationMetadata'
import SummarySearchMetrics from 'src/components/SummarySearchMetrics/SummarySearchMetrics'
import Loading from 'src/components/Loading/Loading'

interface Props {
  rorid: string
}

export default function Content(props: Props) {
  const { rorid: rorId } = props
  const { data, error, loading } = useROROrganization(rorId)
  if (loading) return <Loading />
  const organization = data?.organization || {} as OrganizationType

  if (error || !organization) return (
    <Col md={{ span: 9, offset: 3 }}>
      <Error title="An error occured fetching the Organization." />
    </Col>
  )

  return (
    <>
        <Container fluid>
          <Row className="mb-4">
            <Col md={{ offset: 3 }}>
              <Title title={organization.name} titleLink={organization.id} link={organization.id} />
            </Col>
          </Row>

          <Row>
            <Col md={3} className="pe-4">
              <DownloadReports
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
                variables={{ rorId }}
              />
            </Col>
            <Col md={9} className="px-0">
              <SummarySearchMetrics rorId={organization.id} />
              {organization.inceptionYear && (
                <p className="mb-3">Founded {organization.inceptionYear}</p>
              )}
              <OrganizationMetadata metadata={organization}
                linkToExternal={false}
                showTitle={false} />
            </Col>
          </Row>
        </Container>
    </>
  )
}
