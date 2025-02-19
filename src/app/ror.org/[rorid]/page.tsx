import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Content from './Content'
import RelatedContent from './RelatedContent'
import { fetchOrganizationMetadata } from 'src/data/queries/organizationQuery'


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
    const { data } = await fetchOrganizationMetadata(rorid)

    if (!data) {
      notFound()
    }

    const organization = data.organization
    const title = organization.name
      ? 'DataCite Commons: ' + organization.name
      : 'DataCite Commons: No Name'


    const pageUrl =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
        ? 'https://commons.datacite.org/ror.org/' + rorid
        : 'https://commons.stage.datacite.org/ror.org/' + rorid


    const imageUrl =
      process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
        ? 'https://commons.datacite.org/images/logo.png'
        : 'https://commons.stage.datacite.org/images/logo.png'


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
