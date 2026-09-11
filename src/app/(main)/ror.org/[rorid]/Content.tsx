'use client'
import React from 'react'

import type { MinimalOrganization as OrganizationType } from 'src/data/queries/searchOrganizationQuery'
import { useROROrganization } from 'src/data/queries/searchOrganizationQuery'

import Error from 'src/components/Error/Error'
import Title from 'src/components/Title/Title'
import DownloadReports from 'src/components/DownloadReports/DownloadReports'
import OrganizationMetadata from 'src/components/OrganizationMetadata/OrganizationMetadata'
import SummarySearchMetrics from 'src/components/SummarySearchMetrics/SummarySearchMetrics'
import Loading from 'src/components/Loading/Loading'
import CommonsLayout from 'src/components/CommonsLayout/CommonsLayout'

interface Props {
  rorid: string
}

export default function Content(props: Props) {
  const { rorid: rorId } = props
  const { data, error, loading } = useROROrganization(rorId)
  if (loading) return <Loading />
  const organization = data?.organization || ({} as OrganizationType)

  if (error || !organization)
    return (
      <CommonsLayout>
        <Error title="An error occured fetching the Organization." />
      </CommonsLayout>
    )

  return (
    <>
      <CommonsLayout className="mb-4">
        <Title
          title={organization.name}
          titleLink={organization.id}
          link={organization.id}
        />
      </CommonsLayout>

      <CommonsLayout
        sidebarClassName="pe-4"
        mainClassName="px-0"
        sidebar={
          <DownloadReports
            links={[
              {
                title: 'Related Works (CSV)',
                helpText:
                  'Includes descriptions and formatted citations in APA style for up to 200 DOIs associated with this organization.',
                type: 'ror/related-works'
              },
              {
                title: 'Funders (CSV)',
                helpText:
                  'Includes up to 200 funders associated with related works.',
                type: 'ror/funders'
              }
            ]}
            variables={{ rorId }}
          />
        }
      >
        <SummarySearchMetrics rorId={organization.id} />
        {organization.inceptionYear && (
          <p className="mb-3">Founded {organization.inceptionYear}</p>
        )}
        <OrganizationMetadata
          metadata={organization}
          linkToExternal={false}
          showTitle={false}
        />
      </CommonsLayout>
    </>
  )
}
