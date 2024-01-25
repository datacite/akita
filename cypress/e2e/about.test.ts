/// <reference types="cypress" />

describe('About', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit('/about')
  })

  it('header', () => {
    cy.get('.member', { timeout: 30000 }).contains('About')
  })
})

export {}
