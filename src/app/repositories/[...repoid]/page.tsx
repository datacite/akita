import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import apolloClient from 'src/utils/server/apolloClient'
import Content from './Content'
import Loading from 'src/components/Loading/Loading'
import { MetadataQueryData, MetadataQueryVar, REPOSITORY_METADATA_QUERY } from 'src/data/queries/repositoryQuery'


interface Props {
  params: {
    repoid: string[]
  }
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const repoid = params.repoid.join('/')
  
  const { data } = await apolloClient.query<MetadataQueryData, MetadataQueryVar>({
    query: REPOSITORY_METADATA_QUERY,
    variables: { id: repoid },
    errorPolicy: 'all'
  })

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

  const repo = data.repository

  const title = repo.name
    ? 'DataCite Commons: ' + repo.name
    : 'DataCite Commons: No Name'

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
    ? 'https://commons.datacite.org/'
    : 'https://commons.stage.datacite.org/'

  const pageUrl = repo.re3dataDoi
    ? baseUrl + "repositories/" + repo.re3dataDoi
    : baseUrl + "repositories/" + repo.id


  const imageUrl = baseUrl + "images/logo.png"

  return {
    title: title,

    openGraph: {
      title: title,
      // type: 'repository',
      url: pageUrl,
      images: [{ url: imageUrl }]
    }
  }
}



export default async function Page({ params }: Props) {
  const repoid = params.repoid.join('/')

  // Fetch Repository metadata
  const { data } = await apolloClient.query<MetadataQueryData, MetadataQueryVar>({
    query: REPOSITORY_METADATA_QUERY,
    variables: { id: repoid },
    errorPolicy: 'all'
  })

  if (!data) notFound()

  return (
    <Suspense fallback={<Loading />}>
      <Content variables={{ id: repoid }} />
    </Suspense>
  )
}


