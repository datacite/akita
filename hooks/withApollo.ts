import withApollo from 'next-with-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'
// import { setContext } from '@apollo/client/link/context'
// import { Cookies } from 'react-cookie-consent'

export default withApollo(
  ({ initialState }) =>
    new ApolloClient({
      uri:
        (process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org') +
        '/graphql',
      cache: new InMemoryCache().restore(initialState || {})
    })
)

// export default withApollo(({ initialState }) => {
//   // needed for CORS, see https://www.apollographql.com/docs/react/networking/authentication/#cookie
//   // TODO support 'include' for CORS in API
//   // const credentials = 'include' // 'same-origin'

//   const httpLink = createHttpLink({
//     uri:
//       (process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org') +
//       '/graphql',
//     // TODO
//     // credentials: credentials
//   })

//   const authLink = setContext((_, { headers }) => {
//     // TODO
//     // get the authentication token from cookie if it exists
//     // const sessionCookie = Cookies.getJSON('_datacite')
//     // const token =
//     //   sessionCookie &&
//     //   sessionCookie.authenticated &&
//     //   sessionCookie.authenticated.access_token

//     // return the headers to the context so httpLink can read them
//     return {
//       headers: {
//         ...headers,
//         // TODO
//         // authorization: token ? `Bearer ${token}` : ''
//       }
//     }
//   })

//   const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache()
//   })

//   return client
// })
