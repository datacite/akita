import { cookies } from 'next/headers'

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('_datacite')?.value

  if (!raw) {
    return undefined
  }

  let sessionCookie: { authenticated?: { access_token?: string } }
  try {
    sessionCookie = JSON.parse(raw)
  } catch {
    return undefined
  }

  return sessionCookie?.authenticated?.access_token
}

export interface AuthSession {
  token: string
  uid: string
}

export async function getAuthSession(): Promise<AuthSession | undefined> {
  const token = await getAuthToken()
  if (!token) return undefined

  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
    if (!decoded?.uid) return undefined

    return { token, uid: decoded.uid }
  } catch {
    return undefined
  }
}
