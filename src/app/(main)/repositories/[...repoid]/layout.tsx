import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { fetchRepository } from 'src/data/queries/repositoryQuery'
import Content from './Content'
import Loading from 'src/components/Loading/Loading'
import Container from 'react-bootstrap/Container'

interface Props extends PropsWithChildren {
  params: Promise<{
    repoid: string[]
  }>
}

export default async function Layout(props: Props) {
  const params = await props.params
  const repoid = params.repoid.map(decodeURIComponent).join('/')

  // Fetch Repository metadata (moved from page.tsx)
  const { data, error } = await fetchRepository(repoid)

  if (error) throw error // Let error boundary handle server errors
  if (!data) notFound()

  return (
    <Container fluid>
      <Suspense fallback={<Loading />}>
        <Content variables={{ id: repoid }} />
      </Suspense>
      
      {/* Render page.tsx content */}
      {props.children}
    </Container>
  )
}
