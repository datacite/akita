import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import truncate from 'lodash/truncate'

import Content from './Content'
import { fetchPerson } from 'src/data/queries/personQuery'
import RelatedContent from './RelatedContent'
import Loading from 'src/components/Loading/Loading'
import { COMMONS_URL, LOGO_URL } from 'src/data/constants'


interface Props {
  params: Promise<{
    orcid: string
  }>
}



export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const { data, error } = await fetchPerson(params.orcid)
    if (!data || error) notFound()

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
        url: `${COMMONS_URL}/orcid.org/${params.orcid}`,
        // type: type,
        images: [{ url: LOGO_URL }]
      }
    }
  } catch (error) {
    notFound()
  }
}

export default async function Page(props: Props) {
  const params = await props.params;
  const orcid = params.orcid.toUpperCase()

  if (params.orcid != orcid)
    redirect(`/orcid.org/${orcid}/`)

  return <>
    <Suspense fallback={<Loading />}>
      <Content orcid={orcid} />
    </Suspense>
    <RelatedContent />
  </>
}


