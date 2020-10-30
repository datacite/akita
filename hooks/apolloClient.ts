import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri:
      (process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org') +
      '/graphql',
    credentials: 'same-origin'
  }),
  cache: new InMemoryCache()
})

export default apolloClient
