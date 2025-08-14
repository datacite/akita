import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import apolloClientBuilder from './builder'

export function getAuthToken() {
  const sessionCookie = JSON.parse(((cookies() as unknown as UnsafeUnwrappedCookies).get('_datacite') as any)?.value || '{}')
  return sessionCookie?.authenticated?.access_token
}

const apolloClient = apolloClientBuilder(getAuthToken)
export default apolloClient
