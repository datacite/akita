'use client'
 
import React, { PropsWithChildren } from 'react'
import { useSearchParams } from 'next/navigation'
import PlausibleProvider from 'next-plausible'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { FlagsProvider } from 'flagged'


interface Props extends PropsWithChildren {
  default_features: string[]
  apolloUrl: string
  authToken?: string
}
 
export default function Providers({ default_features, apolloUrl, authToken, children }: Props) {
  // const router = useRouter()

  const searchParams = useSearchParams()
  const paramFeatures = searchParams?.getAll('features') || []

  const features = default_features.concat(paramFeatures)



  // needed for CORS, see https://www.apollographql.com/docs/react/networking/authentication/#cookie
  const httpLink = createHttpLink({
    uri: `${apolloUrl}/graphql`,
    credentials: 'include'
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from cookie if it exists
    const sessionCookie = authToken as any
    const token =
      sessionCookie &&
      sessionCookie.authenticated &&
      sessionCookie.authenticated.access_token

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Creator: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false
        },
        Contributor: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false
        },
        Affiliation: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false
        },
        Facet: {
          keyFields: false
        },
        MultiFacet: {
          keyFields: false
        }
      }
    })
  })



  return <FlagsProvider features={features}>
    <ApolloProvider client={apolloClient}>
      <PlausibleProvider domain="commons.datacite.org">
        {children}
      </PlausibleProvider>
    </ApolloProvider>
  </FlagsProvider>
}