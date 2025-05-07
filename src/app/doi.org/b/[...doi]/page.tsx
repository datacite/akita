import React from 'react'
import { notFound } from 'next/navigation'
import { fetchDoi } from 'src/data/queries/doiQuery'
import RelatedContent from './RelatedContentBeta'


interface Props {
  params: {
    doi: string[]
  }
}

export default async function Page({ params }: Props) {
  const doi = decodeURIComponent(params.doi.join('/'))


  // Fetch DOI metadata
  const { data } = await fetchDoi(doi)

  if (!data) notFound()

  return <>
    <RelatedContent />
  </>
}
