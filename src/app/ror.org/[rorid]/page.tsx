import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Content from './Content'
import RelatedContent from './RelatedContent'
import { RORV2Client } from 'src/data/clients/ror-v2-client'
import { COMMONS_URL, LOGO_URL } from 'src/data/constants'

interface Props {
  params: {
    rorid: string
  }
}
function isValidRORId(rorid: string): boolean {
  const rorIdPattern = /^0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2}$/
  return rorIdPattern.test(rorid)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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



export default function Page({ params }: Props) {
  const { rorid } = params
  return (
    <>
      <Content rorid={rorid} />
      <RelatedContent />
    </>
  )
}
