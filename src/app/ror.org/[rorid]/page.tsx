import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Content from './Content'
import RelatedContent from './RelatedContent'
import { RORV2Client } from 'src/data/clients/ror-v2-client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
  ? 'https://commons.datacite.org'
  : 'https://commons.stage.datacite.org'

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

    if (!organization) {
      notFound()
    }

    // Get the primary name from the names array
    const primaryName = organization?.names?.find(name =>
      name.lang === 'en' && name.types?.includes('primary'))?.value || organization.names[0]?.value

    const title = primaryName
      ? 'DataCite Commons: ' + primaryName
      : 'DataCite Commons: No Name'

    const pageUrl = `${BASE_URL}/ror.org/${rorid}`
    const imageUrl = `${BASE_URL}/images/logo.png`


    return {
      title: title,
      openGraph: {
        title: title,
        // type: 'organization',
        url: pageUrl,
        images: [{ url: imageUrl }]
      }
    }
  } catch(error){
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
