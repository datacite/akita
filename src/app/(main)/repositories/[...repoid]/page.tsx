import React from 'react'
import { Metadata } from 'next'
import { fetchRepository } from 'src/data/queries/repositoryQuery'
import { COMMONS_URL, LOGO_URL } from 'src/data/constants'
import RelatedContent from './RelatedContent'


interface Props {
  params: Promise<{
    repoid: string[]
  }>
}



export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const repoid = decodeURIComponent(params.repoid.join('/'))

  const { data } = await fetchRepository(repoid)

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
  const title = `DataCite Commons: ${repo.name || 'No Name'}`

  return {
    title,

    openGraph: {
      title,
      // type: 'repository',
      url: `${COMMONS_URL}/repositories/${repo.re3doi || repo.id}`,
      images: [{ url: LOGO_URL }]
    }
  }
}



export default async function Page(props: Props) {
  const params = await props.params;
  const repoid = decodeURIComponent(params.repoid.join('/'))

  // Content rendering moved to layout.tsx
  // Fetch repository data to check clientId and pass to RelatedContent
  const { data } = await fetchRepository(repoid)

import { notFound } from 'next/navigation'
import { Metadata } from 'next'

  if (!data) notFound()

  return data.repository.clientId ? <RelatedContent repository={data.repository} /> : null
}

