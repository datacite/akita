import { Cookies } from 'react-cookie-consent'
import JsonWebToken from 'jsonwebtoken'
import { JWT_KEY } from 'src/data/constants'

export const session = () => {
  // RSA public key
  if (!JWT_KEY) return null

  const sessionCookie = Cookies.getJSON('_datacite')
  const token = sessionCookie?.authenticated?.access_token
  if (!token) return null

  let user: any = null
  function setUser(error: any, payload: any) {
    if (error) {
      console.log('JWT verification error: ' + error.message)
      return
    }

    user = payload
  }

  // verify asymmetric token, using RSA with SHA-256 hash algorithm
  JsonWebToken.verify(token, JWT_KEY, { algorithms: ['RS256'] }, setUser)

  return user
}
