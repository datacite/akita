/**
 * JWT Helper for Testing
 *
 * This module provides utilities for generating and managing JWT tokens
 * for testing purposes. Signing and verification run in Cypress Node tasks;
 * the public key is loaded from fixtures when needed.
 */

export interface JWTPayload {
  uid: string
  name: string
  exp?: number
  iat?: number
}

/** Decoded JWT payload returned by verifyJWT task (matches signed payload + standard claims). */
export type DecodedJwt = JWTPayload

export interface JWTKeys {
  publicKey: string
}

/**
 * Load JWT test public key from fixtures (jwt-keys.json contains only publicKey).
 */
export function loadJWTKeys(): Cypress.Chainable<JWTKeys> {
  return cy.fixture('jwt-keys').then((keys: JWTKeys) => keys)
}

/**
 * Generate a valid JWT token for testing via Node task (uses TEST_JWT_PRIVATE_KEY).
 * @param payload - The JWT payload (uid and name are required)
 * @param expiresIn - Expiration time (default: '1h')
 * @returns Cypress.Chainable<string> - The signed JWT token
 */
export function generateTestJWT(
  payload: JWTPayload,
  expiresIn: string = '1h'
): Cypress.Chainable<string> {
  return cy.task<string>('signJWT', { payload, expiresIn })
}

/**
 * Generate an expired JWT token for testing via Node task.
 * @param payload - The JWT payload
 * @returns Cypress.Chainable<string> - The expired JWT token
 */
export function generateExpiredTestJWT(payload: JWTPayload): Cypress.Chainable<string> {
  return cy.task<string>('signExpiredJWT', { payload })
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
  }) as unknown as Cypress.Chainable<void>
}

/**
 * Verify JWT token with public key via Node task (uses NEXT_PUBLIC_JWT_PUBLIC_KEY).
 * @param token - The JWT token to verify
 * @returns Cypress.Chainable<DecodedJwt | null> - The decoded payload or null if verification fails
 */
export function verifyTestJWT(token: string): Cypress.Chainable<DecodedJwt | null> {
  return cy.task<DecodedJwt | null>('verifyJWT', { token })
}
