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
