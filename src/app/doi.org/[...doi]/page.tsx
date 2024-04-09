import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import truncate from 'lodash/truncate'

import { rorFromUrl, isProject, isDMP } from 'src/utils/helpers'

import apolloClient from 'src/utils/server/apolloClient'
import { CROSSREF_FUNDER_GQL } from 'src/data/queries/crossrefFunderQuery'
import Content from './Content'
import { DOI_METADATA_GQL, MetadataQueryData, MetadataQueryVar } from 'src/data/queries/doiQuery'
import RelatedContent from './RelatedContent'
import Loading from 'src/components/Loading/Loading'


interface Props {
  params: {
    doi: string[]
  },
  searchParams: {
    id: string
    filterQuery?: string
    cursor?: string
    published?: string
    "resource-type-id"?: string
    language?: string
    license?: string
    "field-of-science"?: string
    "registration-agency"?: string
    "connection-type"?: string

    isBot: string
  }
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doi = params.doi.join('/')
  
  const { data } = await apolloClient.query<MetadataQueryData, MetadataQueryVar>({
    query: DOI_METADATA_GQL,
    variables: { id: doi },
    errorPolicy: 'all'
  })

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


  // <script type="application/ld+json">{work.schemaOrg}</script>
 

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

function mapSearchparams (searchParams: Props['searchParams']) {
  return {
    filterQuery: searchParams.filterQuery,
    cursor: searchParams.cursor,
    published: searchParams.published,
    resourceTypeId: searchParams['resource-type-id'],
    language: searchParams.language,
    license: searchParams.license,
    fieldOfScience: searchParams['field-of-science'],
    registrationAgency: searchParams['registration-agency'],
    connectionType: searchParams['connection-type'],
    isBot: searchParams.isBot
  }
}


export default async function Page({ params, searchParams }: Props) {
  const doi = params.doi.join('/')
  const { connectionType, isBot, ...vars } = mapSearchparams(searchParams)
  const variables = { id: doi, ...vars }


  // Redirect to organization page if DOI is a Crossref Funder ID
  if (doi.startsWith('10.13039')) {
    const { data } = await apolloClient.query({
      query: CROSSREF_FUNDER_GQL,
      variables: { crossrefFunderId: doi },
      errorPolicy: 'all'
    })
    
    if (!data) notFound()
    redirect(`/ror.org${rorFromUrl(data.organization.id)}?filterQuery=${vars.filterQuery}`)
  }


  // Fetch DOI metadata
  const { data } = await apolloClient.query<MetadataQueryData, MetadataQueryVar>({
    query: DOI_METADATA_GQL,
    variables: { id: doi },
    errorPolicy: 'all'
  })

  if (!data) notFound()

  const showSankey = isDMP(data.work) || isProject(data.work)


  return <>
    <Suspense fallback={<Loading />}>
      <Content variables={variables} isBot={JSON.parse(isBot)} />
    </Suspense>
    <RelatedContent variables={variables} showSankey={showSankey} connectionType={connectionType} isBot={JSON.parse(isBot)} />
  </>
}


