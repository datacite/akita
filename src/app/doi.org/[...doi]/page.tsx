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
import { COMMONS_URL, IMAGE_URL } from 'src/data/constants'


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

  const title = `DataCite Commons: ${data.work.titles[0]?.title || 'No Title'}`
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
    title,
    description,

    openGraph: {
      title,
      description,
      url: `${COMMONS_URL}/doi.org/${data.work.doi}`,
      // type: type,
      images: [{ url: IMAGE_URL }]
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
