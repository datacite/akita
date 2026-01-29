/// <reference types="cypress" />

import { setAuthenticatedSession } from '../support/jwt-helper'

describe('JWT Authentication', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
  })

  describe('Unauthenticated User', () => {
    it('should show sign in link when not authenticated', () => {
      cy.visit('/')
      cy.get('a[href*="sign_in"]', { timeout: 30000 }).should('be.visible')
    })

    it('should not show user menu when not authenticated', () => {
      cy.visit('/')
      cy.get('#sign-in').should('not.exist')
    })
  })

  describe('Authenticated User (with valid JWT)', () => {
    beforeEach(() => {
      // Set up authenticated session with valid JWT token using test fixtures
      // This will work if NEXT_PUBLIC_JWT_PUBLIC_KEY is set to the test public key
      setAuthenticatedSession({ uid: 'test-user-123', name: 'Test User' })
    })

    it('should display user name when authenticated with valid JWT', () => {
      // Skip if JWT public key is not configured for tests
      if (!Cypress.env('jwtPublicKey') && !Cypress.env('NEXT_PUBLIC_JWT_PUBLIC_KEY')) {
        cy.log('Skipping: NEXT_PUBLIC_JWT_PUBLIC_KEY not configured for tests')
        return
      }
      
      cy.visit('/')
      cy.get('#sign-in', { timeout: 30000 }).should('be.visible')
    })

    it('should show user dropdown menu when authenticated with valid JWT', () => {
      // Skip if JWT public key is not configured for tests
      if (!Cypress.env('jwtPublicKey') && !Cypress.env('NEXT_PUBLIC_JWT_PUBLIC_KEY')) {
        cy.log('Skipping: NEXT_PUBLIC_JWT_PUBLIC_KEY not configured for tests')
        return
      }
      
      cy.visit('/')
      cy.get('#sign-in', { timeout: 30000 }).click()
      cy.get('[data-cy=settings]').should('be.visible')
    })
  })

  describe('Invalid JWT Token', () => {
    it('should handle invalid token gracefully', () => {
      // Set an invalid JWT token
      const invalidCookie = JSON.stringify({
        authenticated: {
          access_token: 'invalid.jwt.token'
        }
      })
      cy.setCookie('_datacite', invalidCookie)
      
      cy.visit('/')
      // Should behave like unauthenticated user
      cy.get('a[href*="sign_in"]', { timeout: 30000 }).should('be.visible')
    })

    it('should handle malformed cookie gracefully', () => {
      // Set a malformed cookie
      cy.setCookie('_datacite', 'not-valid-json')
      
      cy.visit('/')
      // Should behave like unauthenticated user
      cy.get('a[href*="sign_in"]', { timeout: 30000 }).should('be.visible')
    })

    it('should handle missing access_token in cookie', () => {
      // Set a cookie without access_token
      const incompleteCookie = JSON.stringify({
        authenticated: {}
      })
      cy.setCookie('_datacite', incompleteCookie)
      
      cy.visit('/')
      // Should behave like unauthenticated user
      cy.get('a[href*="sign_in"]', { timeout: 30000 }).should('be.visible')
    })
  })

  describe('JWT Verification Error Handling', () => {
    it('should not crash the app with expired token', () => {
      // Set an expired JWT token (this will be caught by JWT verification)
      const expiredCookie = JSON.stringify({
        authenticated: {
          access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0LXVzZXIiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZXhwIjoxfQ.invalid'
        }
      })
      cy.setCookie('_datacite', expiredCookie)
      
      cy.visit('/')
      // App should still load
      cy.get('body').should('be.visible')
      cy.get('a[href*="sign_in"]', { timeout: 30000 }).should('be.visible')
    })

    it('should not crash the app with corrupted token', () => {
      // Set a corrupted JWT token
      const corruptedCookie = JSON.stringify({
        authenticated: {
          access_token: 'corrupted-token-that-is-not-valid'
        }
      })
      cy.setCookie('_datacite', corruptedCookie)
      
      cy.visit('/')
      // App should still load
      cy.get('body').should('be.visible')
      cy.get('a[href*="sign_in"]', { timeout: 30000 }).should('be.visible')
    })
  })

  describe('Session Persistence', () => {
    it('should maintain session across page navigations', () => {
      // Set a cookie (even though token verification may fail without proper JWT setup)
      const testCookie = JSON.stringify({
        authenticated: {
          access_token: 'test.token.value'
        }
      })
      cy.setCookie('_datacite', testCookie)
      
      cy.visit('/')
      // Cookie should be present on first page
      cy.getCookie('_datacite').should('exist')
      
      // Navigate to different pages
      cy.visit('/about')
      cy.get('body').should('be.visible')
      
      // Cookie should still be present after navigation
      cy.getCookie('_datacite').should('exist')
      
      // Authentication state should remain consistent (signed out in this case)
      cy.get('a[href*="sign_in"]', { timeout: 30000 }).should('be.visible')
    })

    it('should handle session when NEXT_PUBLIC_JWT_PUBLIC_KEY is not configured', () => {
      // This test verifies that when NEXT_PUBLIC_JWT_PUBLIC_KEY env var is not set,
      // the app doesn't crash but handles it gracefully
      const testCookie = JSON.stringify({
        authenticated: {
          access_token: 'test.token.value'
        }
      })
      cy.setCookie('_datacite', testCookie)
      
      cy.visit('/')
      // App should still be functional
      cy.get('body').should('be.visible')
      // Should show sign in link since JWT verification fails without the key
      cy.get('a[href*="sign_in"]', { timeout: 30000 }).should('be.visible')
    })
  })
})

export {}
