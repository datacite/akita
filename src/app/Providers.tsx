'use client'

import React, { PropsWithChildren } from 'react'
import { useSearchParams } from 'next/navigation'
import { FlagsProvider } from 'flagged'
import ApolloProvider from 'src/utils/apolloClient/provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { FEATURE_FLAGS } from 'src/data/constants'


interface Props extends PropsWithChildren {
  authToken: string
}

const queryClient = new QueryClient()

export default function Providers({ authToken, children }: Props) {
  // Construct feature flags based on query param, we have to wrap into array as
  // the query string can parse into string || string[]
  // Use like ?features=feature1&?features=feature2
  const searchParams = useSearchParams()
  const paramFeatures = searchParams?.getAll('features') || []
  const features = FEATURE_FLAGS.concat(paramFeatures)


  return <FlagsProvider features={features}>
    <ApolloProvider token={authToken}>
      <QueryClientProvider client={queryClient}>
        <SSRProvider>
          {children}
        </SSRProvider>
      </QueryClientProvider >
    </ApolloProvider>
  </FlagsProvider>
}
