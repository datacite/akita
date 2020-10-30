import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri:
      (process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org') +
      '/graphql',
    credentials: 'same-origin'
  }),
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
      }
    }
  })
})

export default apolloClient
