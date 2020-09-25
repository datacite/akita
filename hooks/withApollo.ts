import withApollo from 'next-with-apollo'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Cookies } from 'react-cookie-consent'

export default withApollo(({ initialState }) => {
  // needed for CORS, see https://www.apollographql.com/docs/react/networking/authentication/#cookie
  const httpLink = createHttpLink({
    uri:
      (process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org') +
      '/graphql',
    credentials: 'same-origin'
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from cookie if it exists
    const sessionCookie = Cookies.getJSON('_datacite')
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

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Creator: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false
        }
      }
    }).restore(initialState || {})
  })

  return client
})
