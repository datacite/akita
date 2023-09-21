/// <reference types="cypress" />

describe('Consent', () => {
  const sizes = ['iphone-6', 'samsung-s10', 'ipad-2', [1024, 768]]

  sizes.forEach((size) => {
    it(`index on ${size} screen`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1])
      } else {
        cy.viewport(size)
      }

      cy.getCookie('_consent').should('not.exist')

      cy.visit('/')
      cy.get('.CookieConsent', { timeout: 30000 }).contains(
        'We use cookies on our website. Some are technically necessary, others help us improve your user experience.'
      )
      cy.get('#rcc-confirm-button').should("exist")
      cy.get('#rcc-confirm-button').click()
      cy.wait(1000)
      cy.getCookie('_consent').should('have.property', 'value', 'true')
      cy.get('.navbar-brand .commons-logo', { timeout: 30000 }).should('have.attr', 'src').should('include','commons-logo.svg')
    })
  })

  it('works', () => {
    cy.getCookie('_consent').should('not.exist')

    cy.visit('/doi.org')
    cy.get('.CookieConsent', { timeout: 30000 }).contains(
      'We use cookies on our website. Some are technically necessary, others help us improve your user experience.'
    )
    cy.get('#rcc-confirm-button').click()
    cy.getCookie('_consent').should('have.property', 'value', 'true')
    cy.get('.navbar-brand .commons-logo', { timeout: 30000 }).should('have.attr', 'src').should('include','commons-logo.svg')
  })

  it('people', () => {
    cy.getCookie('_consent').should('not.exist')

    cy.visit('/orcid.org')
    cy.get('.CookieConsent', { timeout: 30000 }).contains(
      'We use cookies on our website. Some are technically necessary, others help us improve your user experience.'
    )
    cy.get('#rcc-confirm-button').click()
    cy.getCookie('_consent').should('have.property', 'value', 'true')
    cy.get('.navbar-brand .commons-logo', { timeout: 30000 }).should('have.attr', 'src').should('include','commons-logo.svg')
  })

  it('organizations', () => {
    cy.getCookie('_consent').should('not.exist')

    cy.visit('/ror.org')
    cy.get('.CookieConsent', { timeout: 30000 }).contains(
      'We use cookies on our website. Some are technically necessary, others help us improve your user experience.'
    )
    cy.get('#rcc-confirm-button').click()
    cy.getCookie('_consent').should('have.property', 'value', 'true')
    cy.get('.navbar-brand .commons-logo', { timeout: 30000 }).should('have.attr', 'src').should('include','commons-logo.svg')
  })
})

export {}
