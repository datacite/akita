import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import apolloClientBuilder from './builder'

export function getAuthToken(): string {
  try {
    const raw = ((cookies() as unknown as UnsafeUnwrappedCookies).get('_datacite') as any)?.value || '{}'
    const sessionCookie = JSON.parse(raw)
    if (sessionCookie === null || typeof sessionCookie !== 'object') {
      return ''
    }
    return sessionCookie?.authenticated?.access_token ?? ''
  } catch {
    return ''
  }
}

const apolloClient = apolloClientBuilder(getAuthToken)
export default apolloClient
