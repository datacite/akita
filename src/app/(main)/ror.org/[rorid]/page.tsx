import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidRORId } from 'src/utils/ror'
import RelatedContent from './RelatedContent'
import { RORV2Client } from 'src/data/clients/ror-v2-client'
import { COMMONS_URL, LOGO_URL } from 'src/data/constants'

interface Props {
  params: Promise<{
    rorid: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { rorid } = params
  if (!isValidRORId(rorid)) {
    notFound()
  }

  try {
    const rorClient = new RORV2Client()
    const organization = await rorClient.getOrganization(rorid)

    if (!organization) notFound()

    // Get the primary name from the names array
    const primaryName = organization?.names?.find(name =>
      name.lang === 'en' && name.types?.includes('primary'))?.value || organization.names[0]?.value

    const title = `DataCite Commons: ${primaryName || 'No Name'}`

    return {
      title,
      openGraph: {
        title,
        // type: 'organization',
        url: `${COMMONS_URL}/ror.org/${rorid}`,
        images: [{ url: LOGO_URL }]
      }
    }
  } catch (error) {
    notFound()
  }
}



export default async function Page(props: Props) {
  const params = await props.params
  const { rorid } = params

  // Content rendering moved to layout.tsx
  return <RelatedContent rorId={rorid} />
}
