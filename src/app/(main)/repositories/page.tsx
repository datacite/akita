'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

import { RepositoriesExampleText } from 'src/components/ExampleText/ExampleText'
import SearchRepository from 'src/components/SearchRepository/SearchRepository'
import { QueryVar } from 'src/data/queries/searchRepositoryQuery'

function getQueryVariables(searchParams: URLSearchParams): QueryVar {
  return {
    query: searchParams.get('query') ?? '',
    cursor: searchParams.get('cursor') ?? undefined,
    certificate: searchParams.get('certificate') ?? undefined,
    software: searchParams.get('software') ?? undefined,
    hasPid: searchParams.get('hasPid') ?? undefined,
    isOpen: searchParams.get('isOpen') ?? undefined,
    isCertified: searchParams.get('isCertified') ?? undefined,
    subjectId: searchParams.get('subjectId') ?? undefined,
  }
}

export default function SearchRepositoryPage() {
  const variables = getQueryVariables(useSearchParams())

  if (!variables.query || variables.query === '')
    return <RepositoriesExampleText />

  return <>
    <h1 className="visually-hidden">Repositories Search</h1>
    <SearchRepository variables={variables} />
  </>
}
