import { Cookies } from 'react-cookie-consent'
import JsonWebToken from 'jsonwebtoken'

export const session = () => {
  let user = null
  let jwt = null
  let cert = null

  const sessionCookie = Cookies.getJSON('_datacite')
  console.log(sessionCookie)
  if (sessionCookie && sessionCookie.authenticated) {
    jwt = sessionCookie.authenticated.access_token

    // RSA public key
    cert = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY
      ? process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY.replace(/\\n/g, '\n')
      : null
  }

  if (jwt && cert)
    // verify asymmetric token, using RSA with SHA-256 hash algorithm
    JsonWebToken.verify(jwt, cert, { algorithms: ['RS256'] }, function(error, payload) {
      if (payload) {
        console.log(payload)
        user = payload
      } else if (error) {
        console.log('JWT verification error: ' + error.message)
      }
    })

  return user
}
