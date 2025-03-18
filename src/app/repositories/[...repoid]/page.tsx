import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Content from './Content'
import Loading from 'src/components/Loading/Loading'
import { fetchRepository } from 'src/data/queries/repositoryQuery'
import { COMMONS_URL, LOGO_URL } from 'src/data/constants'
import Container from 'react-bootstrap/Container'
import RelatedContent from './RelatedContent'


interface Props {
  params: {
    repoid: string[]
  }
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
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



export default async function Page({ params }: Props) {
  const repoid = decodeURIComponent(params.repoid.join('/'))

  // Fetch Repository metadata
  const { data } = await fetchRepository(repoid)

  if (!data) notFound()

  return <Container fluid>
    <Suspense fallback={<Loading />}>
      <Content variables={{ id: repoid }} />
    </Suspense>
    {data.repository.clientId && <RelatedContent repository={data.repository} />}
  </Container>
}

