import { createHttpLink } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support'
import { setContext } from '@apollo/client/link/context'

/*
 * getToken is a function as opposed to just a string because otherwise, in server components,
 * this throws an error unless the token is returned from a function that is called
 * in the authLink setContext. I'm not sure why
 */
export default function apolloClientBuilder(getToken: () => string) {
  // needed for CORS, see https://www.apollographql.com/docs/react/networking/authentication/#cookie
  const httpLink = createHttpLink({
    uri:
      (process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org') +
      '/graphql',
    credentials: 'include'
  })

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    const token = getToken()

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  return new ApolloClient({
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
}
