import React from 'react'
import { Metadata } from 'next'
import truncate from 'lodash/truncate'

import { fetchDoi } from 'src/data/queries/doiQuery'
import RelatedContent from './RelatedContent'
import { COMMONS_URL, LOGO_URL } from 'src/data/constants'


interface Props {
  params: Promise<{
    doi: string[]
  }>
}



export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
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
      images: [{ url: LOGO_URL }]
    }
  }
}

export default async function Page(props: Props) {
  const params = await props.params;
  const doi = decodeURIComponent(params.doi.join('/'))

  // Redirect handling moved to layout.tsx
  // Content rendering moved to layout.tsx
  // RelatedAggregateGraph moved to layout.tsx
  // Script tag moved to layout.tsx

  return (
    <RelatedContent />
  )
}
