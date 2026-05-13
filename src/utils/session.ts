import { Cookies } from 'react-cookie-consent'

export type User = {
  uid: string,
  name: string
} | null

function decodeJwtPayload(token: string): any {
  try {
    const payload = token.split('.')[1]
    // base64url -> base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      .padEnd(payload.length + (4 - payload.length % 4) % 4, '=')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export const session = (): User => {
  const sessionCookie = Cookies.getJSON('_datacite')
  const token = sessionCookie?.authenticated?.access_token
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload?.uid || !payload?.name) return null

  return { uid: payload.uid, name: payload.name }
}
