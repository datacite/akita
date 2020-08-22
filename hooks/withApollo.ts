import withApollo from "next-with-apollo"
import { ApolloClient, InMemoryCache } from '@apollo/client'

export default withApollo(
  ({ initialState }) =>
    new ApolloClient({
      uri: (process.env.NEXT_PUBLIC_API_URL || 'https://api.stage.datacite.org') + "/graphql",
      cache: new InMemoryCache().restore(initialState || {})
    })
)