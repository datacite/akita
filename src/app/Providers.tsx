'use client'

import React, { PropsWithChildren } from 'react'
import { useSearchParams } from 'next/navigation'
import { ApolloProvider } from '@apollo/client'
import { FlagsProvider } from 'flagged'
import apolloClientBuilder from 'src/utils/apolloClient/builder'


interface Props extends PropsWithChildren {
  default_features: string[]
  apolloUrl: string
  authToken: string
}

export default function Providers({ default_features, authToken, children }: Props) {
  const searchParams = useSearchParams()
  const paramFeatures = searchParams?.getAll('features') || []

  const features = default_features.concat(paramFeatures)

  const apolloClient = apolloClientBuilder(() => authToken)

  return <FlagsProvider features={features}>
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  </FlagsProvider>
}
