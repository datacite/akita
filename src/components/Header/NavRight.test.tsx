import React from 'react'
import { mount } from '@cypress/react'
import NavRight from './NavRight'
import { generateTestJWT } from '../../../cypress/support/jwt-helper'

describe('NavRight Component with JWT Session', () => {
  const signedInContent = <div data-testid="signed-in">User Menu</div>
  const signedOutContent = <div data-testid="signed-out">Sign In</div>

  beforeEach(() => {
    // Clear cookies before each test
    cy.clearCookies()
  })

  it('should show signed out content when no JWT token is present', () => {
    mount(
      <NavRight
        signedInContent={signedInContent}
        signedOutContent={signedOutContent}
      />
    )
    
    cy.get('[data-testid="signed-out"]').should('be.visible')
    cy.get('[data-testid="signed-in"]').should('not.exist')
  })

  it('should show signed out content when NEXT_PUBLIC_JWT_PUBLIC_KEY is not configured', () => {
    // Set a valid-looking cookie, but without NEXT_PUBLIC_JWT_PUBLIC_KEY env var it should fail
    const cookieValue = JSON.stringify({
      authenticated: {
        access_token: 'some.jwt.token'
      }
    })
    cy.setCookie('_datacite', cookieValue)
    
    mount(
      <NavRight
        signedInContent={signedInContent}
        signedOutContent={signedOutContent}
      />
    )
    
    cy.get('[data-testid="signed-out"]').should('be.visible')
    cy.get('[data-testid="signed-in"]').should('not.exist')
  })

  it('should show signed out content when access_token is not in cookie', () => {
    const cookieValue = JSON.stringify({
      authenticated: {}
    })
    cy.setCookie('_datacite', cookieValue)
    
    mount(
      <NavRight
        signedInContent={signedInContent}
        signedOutContent={signedOutContent}
      />
    )
    
    cy.get('[data-testid="signed-out"]').should('be.visible')
    cy.get('[data-testid="signed-in"]').should('not.exist')
  })

  it('should show signed out content when JWT token is invalid', () => {
    const cookieValue = JSON.stringify({
      authenticated: {
        access_token: 'invalid.jwt.token'
      }
    })
    cy.setCookie('_datacite', cookieValue)
    
    mount(
      <NavRight
        signedInContent={signedInContent}
        signedOutContent={signedOutContent}
      />
    )
    
    cy.get('[data-testid="signed-out"]').should('be.visible')
    cy.get('[data-testid="signed-in"]').should('not.exist')
  })

  it('should show signed in content when valid JWT token is present', () => {
    // Skip if JWT public key is not configured for tests
    if (!Cypress.env('jwtPublicKey') && !Cypress.env('NEXT_PUBLIC_JWT_PUBLIC_KEY')) {
      cy.log('Skipping: NEXT_PUBLIC_JWT_PUBLIC_KEY not configured for tests')
      return
    }

    // Generate a valid JWT token using test fixtures
    generateTestJWT({ uid: 'test-user-123', name: 'Test User' }).then((validToken) => {
      const cookieValue = JSON.stringify({
        authenticated: {
          access_token: validToken
        }
      })
      cy.setCookie('_datacite', cookieValue)
      
      mount(
        <NavRight
          signedInContent={signedInContent}
          signedOutContent={signedOutContent}
        />
      )
      
      cy.get('[data-testid="signed-in"]').should('be.visible')
      cy.get('[data-testid="signed-out"]').should('not.exist')
    })
  })

  it('should handle malformed cookie data gracefully', () => {
    cy.setCookie('_datacite', 'not-valid-json')
    
    mount(
      <NavRight
        signedInContent={signedInContent}
        signedOutContent={signedOutContent}
      />
    )
    
    // Should default to signed out content
    cy.get('[data-testid="signed-out"]').should('be.visible')
    cy.get('[data-testid="signed-in"]').should('not.exist')
  })
})
