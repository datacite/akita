'use client'

import React, { PropsWithChildren } from 'react'
import { useSearchParams } from 'next/navigation'
import { FlagsProvider } from 'flagged'
import ApolloProvider from 'src/utils/apolloClient/provider'
import SSRProvider from 'react-bootstrap/SSRProvider'


interface Props extends PropsWithChildren {
  default_features: string[]
  apolloUrl: string
  authToken: string
}

export default function Providers({ default_features, authToken, children }: Props) {
  const searchParams = useSearchParams()
  const paramFeatures = searchParams?.getAll('features') || []

  const features = default_features.concat(paramFeatures)


  return <FlagsProvider features={features}>
    <ApolloProvider token={authToken}>
      <SSRProvider>
        {children}
      </SSRProvider>
    </ApolloProvider>
  </FlagsProvider>
}
