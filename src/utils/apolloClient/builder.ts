import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// needed for CORS, see https://www.apollographql.com/docs/react/networking/authentication/#cookie
const httpLink = createHttpLink({
  uri:
    (process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org') +
    '/graphql',
  credentials: 'include'
})

const authLink = (token: string) => setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})


export function apolloClientBuilder(token: string) {
  return new ApolloClient({
    ssrMode: true,
    link: authLink(token).concat(httpLink),
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
