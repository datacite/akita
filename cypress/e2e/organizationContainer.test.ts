/// <reference types="cypress" />

describe('OrganizationContainer', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit('/ror.org/052gg0110')
  })

  it('id', () => {
    cy.get('#title-link', { timeout: 30000 }).contains(
      'https://ror.org/052gg0110'
    )
  })

  it('name', () => {
    cy.get('#title', { timeout: 30000 }).contains(
      'University of Oxford'
    )
  })

  // describe('Works', () => {
  //   it('results', () => {
  //     cy.get('input[name="query-facets"]')
  //       .type('carbon-fixing bacteria{enter}')
  //       .get('.member-results', { timeout: 60000 })
  //       .should('contain', '1 Work')
  //   })

  //   it('creators', () => {
  //     cy.get('input[name="query-facets"]')
  //       .type('carbon-fixing bacteria{enter}')
  //       .get('.creators', { timeout: 30000 })
  //       .should('contain', 'Xiaoyan Jing')
  //   })
  // })
})

export {}
