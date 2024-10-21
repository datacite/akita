import React from 'react'
import Content from './Content'

interface Props {
  searchParams: { isBot: string }
}

export default async function StatisticsPage({ searchParams }: Props) {

  return (
    <Content isBot={false} />
  )
}
