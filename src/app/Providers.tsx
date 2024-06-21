'use client'

import React, { PropsWithChildren } from 'react'
import { useSearchParams } from 'next/navigation'
import { ApolloProvider } from '@apollo/client'
import { FlagsProvider } from 'flagged'
import { apolloClientBuilder } from 'src/utils/apolloClient/builder'


interface Props extends PropsWithChildren {
  default_features: string[]
  apolloUrl: string
  authToken: string
}

export default function Providers({ default_features, authToken, children }: Props) {
  // const router = useRouter()

  const searchParams = useSearchParams()
  const paramFeatures = searchParams?.getAll('features') || []

  const features = default_features.concat(paramFeatures)

  return <FlagsProvider features={features}>
    <ApolloProvider client={apolloClientBuilder(authToken)}>
      {children}
    </ApolloProvider>
  </FlagsProvider>
}
