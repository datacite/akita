import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import Content from './Content'
import Loading from 'src/components/Loading/Loading'

interface Props extends PropsWithChildren {
  params: Promise<{
    orcid: string
  }>
}

export default async function Layout(props: Props) {
  const params = await props.params
  const orcid = params.orcid.toUpperCase()

  // Handle uppercase redirect (moved from page.tsx)
  if (params.orcid != orcid)
    redirect(`/orcid.org/${orcid}/`)

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Content orcid={orcid} />
      </Suspense>
      
      {/* Render page.tsx content */}
      {props.children}
    </>
  )
}
