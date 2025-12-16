import { cookies } from 'next/headers';
import apolloClientBuilder from './builder'

export async function getAuthToken() {
  const cookieStore = await cookies()
  const sessionCookie = JSON.parse((cookieStore.get('_datacite') as any)?.value || '{}')
  return sessionCookie?.authenticated?.access_token
}

const apolloClient = apolloClientBuilder(getAuthToken)
export default apolloClient
