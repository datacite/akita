'use client'

import React, { PropsWithChildren, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FlagsProvider } from 'flagged'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { FEATURE_FLAGS } from 'src/data/constants'


const queryClient = new QueryClient()

function FeatureFlagsProvider({ children }: PropsWithChildren) {
  const searchParams = useSearchParams()
  const paramFeatures = searchParams?.getAll('features') || []
  const features = FEATURE_FLAGS.concat(paramFeatures)

  return <FlagsProvider features={features}>{children}</FlagsProvider>
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SSRProvider>
        <Suspense
          fallback={<FlagsProvider features={FEATURE_FLAGS}>{children}</FlagsProvider>}
        >
          <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
        </Suspense>
      </SSRProvider>
    </QueryClientProvider>
  )
}
