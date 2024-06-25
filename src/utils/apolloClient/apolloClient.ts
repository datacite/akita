import { cookies } from 'next/headers'
import apolloClientBuilder from './builder'

export function getAuthToken() {
  const sessionCookie = JSON.parse((cookies().get('_datacite') as any)?.value || '{}')
  return sessionCookie &&
    sessionCookie.authenticated &&
    sessionCookie.authenticated.access_token
}

const apolloClient = apolloClientBuilder(getAuthToken)
export default apolloClient
