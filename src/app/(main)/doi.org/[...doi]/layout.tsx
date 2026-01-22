import React, { Suspense } from 'react'
import { redirect, notFound } from 'next/navigation'
import Script from 'next/script'
import { PropsWithChildren } from 'react'

import { rorFromUrl } from 'src/utils/helpers'
import { fetchCrossrefFunder } from 'src/data/queries/crossrefFunderQuery'
import { fetchDoi } from 'src/data/queries/doiQuery'
import Content from './Content'
import RelatedAggregateGraph from './RelatedAggregateGraph'
import Loading from 'src/components/Loading/Loading'

interface Props extends PropsWithChildren {
  params: Promise<{
    doi: string[]
  }>
}

export default async function Layout(props: Props) {
  const params = await props.params
  const doi = decodeURIComponent(params.doi.join('/'))

  // Handle Crossref Funder redirect (moved from page.tsx)
  if (doi.startsWith('10.13039')) {
    const { data } = await fetchCrossrefFunder(doi)

    if (!data) notFound()
    redirect(`/ror.org${rorFromUrl(data.organization.id)}`)
  }

  // Fetch DOI data (moved from page.tsx)
  const { data } = await fetchDoi(doi)

  if (!data) notFound()

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Content doi={doi} />
      </Suspense>
      
      <Suspense>
        <RelatedAggregateGraph doi={doi} />
      </Suspense>
      
      {/* Script tag moved here since we have data.work here */}
      <Script type="application/ld+json" id="schemaOrg">{data.work.schemaOrg}</Script>
      
      {/* Render page.tsx content */}
      {props.children}
    </>
  )
}
