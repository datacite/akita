import React from 'react'
import { mount } from '@cypress/react'
import NavRight from './NavRight'

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

  // Test with a valid JWT token would require setting up proper NEXT_PUBLIC_JWT_PUBLIC_KEY
  // and generating a valid token signed with the corresponding private key
  // This is typically done in integration tests with proper test fixtures
  
  // it('should show signed in content when valid JWT token is present', () => {
  //   // This test would require:
  //   // 1. Setting NEXT_PUBLIC_JWT_PUBLIC_KEY environment variable with the RSA public key
  //   // 2. Creating a valid JWT token signed with the corresponding private key
  //   // 3. Setting the cookie with the valid token
  //   
  //   const validToken = 'valid.jwt.token.signed.with.private.key'
  //   const cookieValue = JSON.stringify({
  //     authenticated: {
  //       access_token: validToken
  //     }
  //   })
  //   cy.setCookie('_datacite', cookieValue)
  //   
  //   mount(
  //     <NavRight
  //       signedInContent={signedInContent}
  //       signedOutContent={signedOutContent}
  //     />
  //   )
  //   
  //   cy.get('[data-testid="signed-in"]').should('be.visible')
  //   cy.get('[data-testid="signed-out"]').should('not.exist')
  // })

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
