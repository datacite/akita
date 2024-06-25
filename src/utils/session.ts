import { Cookies } from 'react-cookie-consent'
import JsonWebToken from 'jsonwebtoken'

export const session = () => {
  // RSA public key
  const cert = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY
    ? process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY.replace(/\\n/g, '\n')
    : null
  let jwt = null
  let user = null

  const sessionCookie = Cookies.getJSON('_datacite')
  if (sessionCookie && sessionCookie.authenticated) {
    jwt = sessionCookie.authenticated.access_token
  }

  if (jwt && cert)
    // verify asymmetric token, using RSA with SHA-256 hash algorithm
    JsonWebToken.verify(
      jwt,
      cert,
      { algorithms: ['RS256'] },
      function(error, payload) {
        if (payload) {
          user = payload as any
        } else if (error) {
          console.log('JWT verification error: ' + error.message)
        }
      }
    )

  return user as any
}
