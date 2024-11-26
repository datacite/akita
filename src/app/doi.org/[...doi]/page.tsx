import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Script from 'next/script'
import truncate from 'lodash/truncate'

import { rorFromUrl } from 'src/utils/helpers'

import { fetchCrossrefFunder } from 'src/data/queries/crossrefFunderQuery'
import Content from './Content'
import { fetchDoi } from 'src/data/queries/doiQuery'
import RelatedContent from './RelatedContent'
import RelatedAggregateGraph from './RelatedAggregateGraph'
import Loading from 'src/components/Loading/Loading'


interface Props {
  params: {
    doi: string[]
  }
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doi = decodeURIComponent(params.doi.join('/'))

  const { data } = await fetchDoi(doi)

  if (!data) return {
    title: '',
    description: '',
    openGraph: {
      title: '',
      description: '',
      url: '',
      // type: type,
      images: [{ url: '' }]
    }
  }

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/doi.org/' + data.work.doi
      : 'https://commons.stage.datacite.org/doi.org/' + data.work.doi

  const imageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/images/logo.png'
      : 'https://commons.stage.datacite.org/images/logo.png'

  const title = data.work.titles[0]
    ? 'DataCite Commons: ' + data.work.titles[0].title
    : 'DataCite Commons: No Title'

  const description = !data.work.descriptions[0]
    ? undefined
    : truncate(data.work.descriptions[0].description, {
      length: 2500,
      separator: '… '
    })

  // TODO: Refer here for type https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function:~:text=image.png%22%20/%3E-,Good%20to%20know,-%3A
  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function:~:text=image.png%22%20/%3E-,Good%20to%20know,-%3A
  // const type = metadata.work.registrationAgency.id !== 'datacite' && metadata.work.types.resourceType
  //   ? metadata.work.types.resourceType.toLowerCase()
  //   : metadata.work.types.resourceTypeGeneral?.toLowerCase() || undefined


  return {
    title: title,
    description: description,

    openGraph: {
      title: title,
      description: description,
      url: pageUrl,
      // type: type,
      images: [{ url: imageUrl }]
    }
  }
}

export default async function Page({ params }: Props) {
  const doi = decodeURIComponent(params.doi.join('/'))


  // Redirect to organization page if DOI is a Crossref Funder ID
  if (doi.startsWith('10.13039')) {
    const { data } = await fetchCrossrefFunder(doi)

    if (!data) notFound()
    redirect(`/ror.org${rorFromUrl(data.organization.id)}`)
  }



  // Fetch DOI metadata
  const { data } = await fetchDoi(doi)

  if (!data) notFound()

  return <>
    <Suspense fallback={<Loading />}>
      <Content doi={doi} />
    </Suspense>
    <Suspense>
      <RelatedAggregateGraph doi={doi} />
    </Suspense>
    <RelatedContent />
    <Script type="application/ld+json" id="schemaOrg">{data.work.schemaOrg}</Script>
  </>
}
