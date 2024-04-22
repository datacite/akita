import React from 'react'
import { Row, Col } from "src/components/Layout";

import apolloClient from 'src/utils/server/apolloClient'
import { Organization as OrganizationType } from 'src/data/types'
import { ORGANIZATION_QUERY, QueryData, QueryVar } from 'src/data/queries/organizationQuery';

import Error from 'src/components/Error/Error'
import { Title } from 'src/components/Title/Title'
import DownloadReports from 'src/components/DownloadReports/DownloadReports'
import ShareLinks from 'src/components/ShareLinks/ShareLinks'
import Organization from 'src/components/Organization/Organization'
import { rorFromUrl } from 'src/utils/helpers'

interface Props {
  variables: QueryVar
  isBot?: boolean
}

export default async function Content (props: Props) {
  const { variables, isBot = false } = props

  const { data, error } = await apolloClient.query<QueryData, QueryVar>({
    query: ORGANIZATION_QUERY,
    variables: variables,
    errorPolicy: 'all'
  })

  if (error) return (
    <Col md={9} mdOffset={3}>
      <Error title="An error occured." message={error.message} />
    </Col>
  )

  const organization = data?.organization || {} as OrganizationType


  return (<>
    <Title title={organization.name} titleLink={organization.id} link={organization.id} />

    <Row>
      <Col md={3} className="panel-list" id="side-bar">
        { !isBot && <DownloadReports
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
          variables={variables as any}
        /> }
        <ShareLinks url={'ror.org' + rorFromUrl(organization.id)} title={organization.name} />
      </Col>
      <Col md={9}>
        <Organization organization={organization} />
      </Col>
    </Row>
  </>
  )
}