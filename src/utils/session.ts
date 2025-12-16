import { useState, useEffect } from 'react'
import { Cookies } from 'react-cookie-consent'
import { jwtVerify, importSPKI } from 'jose'
import { JWT_KEY } from 'src/data/constants'

export type User = {
  uid: string,
  name: string
} | null

export const useSession = () => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      // RSA public key
      if (!JWT_KEY) {
        setLoading(false)
        return
      }

      const sessionCookie = Cookies.getJSON('_datacite')
      const token = sessionCookie?.authenticated?.access_token
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const publicKey = await importSPKI(JWT_KEY, 'RS256')
        const { payload } = await jwtVerify(token, publicKey)
        setUser(payload as User)
      } catch (error: any) {
        console.log('JWT verification error: ' + error.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}
