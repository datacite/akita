import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Content from './Content'
import RelatedContent from './RelatedContent'
import Loading from 'src/components/Loading/Loading'
import { fetchOrganizationMetadata } from 'src/data/queries/organizationQuery'


interface Props {
  params: {
    rorid: string
  }
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rorid } = params

  const { data } = await fetchOrganizationMetadata(rorid)

  if (!data) return {
    title: '',
    description: '',
    openGraph: {
      title: '',
      description: '',
      url: '',
      images: [{ url: '' }]
    }
  }

  const organization = data.organization

  const title = organization.name
    ? 'DataCite Commons: ' + organization.name
    : 'DataCite Commons: No Name'


  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/ror.org' + rorid
      : 'https://commons.stage.datacite.org/ror.org' + rorid


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
}



export default async function Page({ params }: Props) {
  const { rorid } = params

  // Fetch Organization metadata
  const { data } = await fetchOrganizationMetadata(rorid)

  if (!data) notFound()

  return <>
    <Suspense fallback={<Loading />}>
      <Content rorid={rorid} />
    </Suspense>
    <RelatedContent />
  </>
}


