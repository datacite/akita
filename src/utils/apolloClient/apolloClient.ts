import { cookies } from 'next/headers'
import { apolloClientBuilder } from './builder'

const sessionCookie = JSON.parse((cookies().get('_datacite') as any).value)
export const token = sessionCookie &&
  sessionCookie.authenticated &&
  sessionCookie.authenticated.access_token

const apolloClient = apolloClientBuilder(token)
export default apolloClient
