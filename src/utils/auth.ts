import { cookies, type UnsafeUnwrappedCookies } from 'next/headers'

export function getAuthToken(): string | undefined {
  const sessionCookie = JSON.parse(
    ((cookies() as unknown as UnsafeUnwrappedCookies).get('_datacite') as { value?: string } | undefined)?.value || '{}'
  )
  return sessionCookie?.authenticated?.access_token
}
