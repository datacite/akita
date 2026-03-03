import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { isValidRORId } from 'src/utils/ror'
import Content from './Content'
import Loading from 'src/components/Loading/Loading'

interface Props extends PropsWithChildren {
  params: Promise<{
    rorid: string
  }>
}

export default async function Layout(props: Props) {
  const params = await props.params
  const { rorid } = params

  if (!isValidRORId(rorid)) notFound()

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Content rorid={rorid} />
      </Suspense>

      {/* Render page.tsx content */}
      {props.children}
    </>
  )
}
