import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Content from './Content'
import Loading from 'src/components/Loading/Loading'
import { fetchRepositoryMetadata } from 'src/data/queries/repositoryQuery'
import { COMMONS_URL, LOGO_URL } from 'src/data/constants'


interface Props {
  params: {
    repoid: string[]
  }
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const repoid = params.repoid.join('/')

  const { data } = await fetchRepositoryMetadata(repoid)

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
      url: `${COMMONS_URL}/repositories/${repo.re3dataDoi || repo.id}`,
      images: [{ url: LOGO_URL }]
    }
  }
}



export default async function Page({ params }: Props) {
  const repoid = decodeURIComponent(params.repoid.join('/'))

  // Fetch Repository metadata
  const { data } = await fetchRepositoryMetadata(repoid)

  if (!data) notFound()

  return <>
    <Suspense fallback={<Loading />}>
      <Content variables={{ id: repoid }} />
    </Suspense>
  </>
}


