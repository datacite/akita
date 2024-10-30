'use client'

import React from 'react';
import useSWR from 'swr'

export default function StatusPage() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR(
    'https://nmtzsv0smzk5.statuspage.io/api/v2/status.json',
    fetcher
  )
  if (error)
    return (
      <a href="http://status.datacite.org" target="_blank" rel="noreferrer">
        <span className="color-dot critical"></span>
        <span className="color-description">Failed to load status</span>
      </a>
    )
  if (!data)
    return (
      <a href="http://status.datacite.org" target="_blank" rel="noreferrer">
        <span className="color-dot loading"></span>
        <span className="color-description">Loading...</span>
      </a>
    )

  return (
    <a href="http://status.datacite.org" target="_blank" rel="noreferrer">
      <span className={'color-dot ' + data.status.indicator}></span>
      <span className="color-description">{data.status.description}</span>
    </a>
  )
}
