import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import truncate from 'lodash/truncate'

import Content from './Content'
import { fetchPersonMetadata } from 'src/data/queries/personQuery'
import RelatedContent from './RelatedContent'
import Loading from 'src/components/Loading/Loading'
import { COMMONS_URL, LOGO_URL } from 'src/data/constants'


interface Props {
  params: {
    orcid: string
  }
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const orcid = 'http://orcid.org/' + params.orcid

  const { data } = await fetchPersonMetadata(orcid)

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

  const person = data.person

  const title = `DataCite Commons: ${person.name || person.id}`
  const description = !data.person.description
    ? undefined
    : truncate(person.description, { length: 2500, separator: '… ' })

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
      url: `${COMMONS_URL}/doi.org/${person.id}`,
      // type: type,
      images: [{ url: LOGO_URL }]
    }
  }
}

export default async function Page({ params }: Props) {
  const orcid = 'http://orcid.org/' + params.orcid


  // Fetch Person metadata
  const { data } = await fetchPersonMetadata(orcid)

  if (!data) notFound()


  return <>
    <Suspense fallback={<Loading />}>
      <Content orcid={params.orcid} />
    </Suspense>
    <RelatedContent />
  </>
}


