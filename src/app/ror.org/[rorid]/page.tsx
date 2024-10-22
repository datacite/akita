import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import apolloClient from 'src/utils/apolloClient/apolloClient'
import Content from './Content'
import RelatedContent from './RelatedContent'
import Loading from 'src/components/Loading/Loading'
import { MetadataQueryData, MetadataQueryVar, ORGANIZATION_METADATA_QUERY } from 'src/data/queries/organizationQuery'
import { Container } from 'react-bootstrap'


interface Props {
  params: {
    rorid: string
  },
  searchParams: {
    id: string
    filterQuery?: string
    published?: string
    "resource-type"?: string
    "field-of-science"?: string
    license?: string
    language?: string
    "registration-agency"?: string
    cursor?: string

    isBot: string
  }
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rorid } = params

  const { data } = await apolloClient.query<MetadataQueryData, MetadataQueryVar>({
    query: ORGANIZATION_METADATA_QUERY,
    variables: { id: rorid },
    errorPolicy: 'all'
  })

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

  const organization = data.organization

  const title = organization.name
    ? 'DataCite Commons: ' + organization.name
    : 'DataCite Commons: No Name'


  const pageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/ror.org' + rorid
      : 'https://commons.stage.datacite.org/ror.org' + rorid


  const imageUrl =
    process.env.NEXT_PUBLIC_API_URL === 'https://api.datacite.org'
      ? 'https://commons.datacite.org/images/logo.png'
      : 'https://commons.stage.datacite.org/images/logo.png'


  return {
    title: title,

    openGraph: {
      title: title,
      // type: 'organization',
      url: pageUrl,
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
    fieldOfScience: searchParams['field-of-science'],
    license: searchParams.license,
    registrationAgency: searchParams['registration-agency'],

    isBot: false
  }
}


export default async function Page({ params, searchParams }: Props) {
  const { rorid } = params
  const { isBot, ...vars } = mapSearchparams(searchParams)
  const variables = { id: rorid, ...vars }

  // Fetch Organization metadata
  const { data } = await apolloClient.query<MetadataQueryData, MetadataQueryVar>({
    query: ORGANIZATION_METADATA_QUERY,
    variables: { id: rorid },
    errorPolicy: 'all'
  })

  if (!data) notFound()

  return <Container fluid>
    <Suspense fallback={<Loading />}>
      <Content variables={variables} isBot={isBot} />
    </Suspense>
    <RelatedContent variables={variables} isBot={isBot} />
  </Container>
}


