/**
 * JWT Helper for Testing
 * 
 * This module provides utilities for generating and managing JWT tokens
 * for testing purposes. It uses test RSA keys stored in fixtures.
 */

import jwt from 'jsonwebtoken'

export interface JWTPayload {
  uid: string
  name: string
  exp?: number
  iat?: number
}

export interface JWTKeys {
  publicKey: string
  privateKey: string
}

/**
 * Load JWT test keys from fixtures
 */
export function loadJWTKeys(): JWTKeys {
  return cy.fixture('jwt-keys').then((keys: JWTKeys) => keys)
}

/**
 * Generate a valid JWT token for testing
 * @param payload - The JWT payload (uid and name are required)
 * @param expiresIn - Expiration time (default: '1h')
 * @returns Promise<string> - The signed JWT token
 */
export function generateTestJWT(
  payload: JWTPayload,
  expiresIn: string = '1h'
): Cypress.Chainable<string> {
  return cy.fixture('jwt-keys').then((keys: JWTKeys) => {
    const token = jwt.sign(
      payload,
      keys.privateKey,
      { 
        algorithm: 'RS256',
        expiresIn 
      }
    )
    return token
  })
}

/**
 * Generate an expired JWT token for testing
 * @param payload - The JWT payload
 * @returns Promise<string> - The expired JWT token
 */
export function generateExpiredTestJWT(
  payload: JWTPayload
): Cypress.Chainable<string> {
  return cy.fixture('jwt-keys').then((keys: JWTKeys) => {
    const token = jwt.sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) - 3600 },
      keys.privateKey,
      { algorithm: 'RS256' }
    )
    return token
  })
}

/**
 * Set up authenticated session with a valid JWT token
 * @param user - User information (uid and name)
 * @param expiresIn - Token expiration time (default: '1h')
 */
export function setAuthenticatedSession(
  user: { uid: string; name: string },
  expiresIn: string = '1h'
): Cypress.Chainable<void> {
  return generateTestJWT(user, expiresIn).then((token) => {
    const cookieValue = JSON.stringify({
      authenticated: {
        access_token: token
      }
    })
    cy.setCookie('_datacite', cookieValue)
  })
}

/**
 * Verify JWT token with public key (for testing verification logic)
 * @param token - The JWT token to verify
 * @returns Promise<any> - The decoded payload or null if verification fails
 */
export function verifyTestJWT(token: string): Cypress.Chainable<any> {
  return cy.fixture('jwt-keys').then((keys: JWTKeys) => {
    return new Promise((resolve) => {
      jwt.verify(token, keys.publicKey, { algorithms: ['RS256'] }, (error, payload) => {
        if (error) {
          resolve(null)
        } else {
          resolve(payload)
        }
      })
    })
  })
}
