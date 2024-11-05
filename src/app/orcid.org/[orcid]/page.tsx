import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import truncate from 'lodash/truncate'

import Content from './Content'
import { fetchPersonMetadata } from 'src/data/queries/personQuery'
import RelatedContent from './RelatedContent'
import Loading from 'src/components/Loading/Loading'


interface Props {
  params: {
    orcid: string
  },
  searchParams: {
    filterQuery?: string
    cursor?: string
    published?: string
    "resource-type"?: string
    language?: string
    license?: string
    "field-of-science"?: string
    "registration-agency"?: string

    isBot: string
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

  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/doi.org/' + person.id
      : 'https://commons.stage.datacite.org/doi.org/' + person.id

  const imageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/images/logo.png'
      : 'https://commons.stage.datacite.org/images/logo.png'

  const title = person.name
    ? 'DataCite Commons: ' + person.name
    : 'DataCite Commons: ' + person.id

  const description = !data.person.description
    ? undefined
    : truncate(person.description, { length: 2500, separator: '… ' })

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

function mapSearchparams(searchParams: Props['searchParams']) {
  return {
    filterQuery: searchParams.filterQuery,
    cursor: searchParams.cursor,
    published: searchParams.published,
    resourceTypeId: searchParams['resource-type'],
    language: searchParams.language,
    license: searchParams.license,
    fieldOfScience: searchParams['field-of-science'],
    registrationAgency: searchParams['registration-agency'],
    isBot: false
  }
}


export default async function Page({ params, searchParams }: Props) {
  const orcid = 'http://orcid.org/' + params.orcid
  const { isBot, ...vars } = mapSearchparams(searchParams)
  const variables = { id: orcid, ...vars }


  // Fetch Person metadata
  const { data } = await fetchPersonMetadata(orcid)

  if (!data) notFound()


  return <>
    <Suspense fallback={<Loading />}>
      <Content variables={variables} isBot={isBot} />
    </Suspense>
    <RelatedContent orcid={params.orcid} variables={variables} isBot={isBot} />
  </>
}


