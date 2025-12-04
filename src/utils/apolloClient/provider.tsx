import React, { PropsWithChildren } from 'react'
import apolloClientBuilder from 'src/utils/apolloClient/builder'
import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support";

export default function ApolloProvider({ token, children }: PropsWithChildren<{ token: string | null }>) {
  return (
    <ApolloNextAppProvider makeClient={() => apolloClientBuilder(async () => token)}>
      {children}
    </ApolloNextAppProvider>
  );
}
