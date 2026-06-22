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
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const decoded = new TextDecoder('utf-8').decode(bytes)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export const session = (): User => {
  const raw = Cookies.get('_datacite')
  let sessionCookie: { authenticated?: { access_token?: string } } | undefined
  try {
    sessionCookie = raw ? JSON.parse(raw) : undefined
  } catch {
    sessionCookie = undefined
  }
  const token = sessionCookie?.authenticated?.access_token
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload?.uid || !payload?.name) return null

  return { uid: payload.uid, name: payload.name }
}
