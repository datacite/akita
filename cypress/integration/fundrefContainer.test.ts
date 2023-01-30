/// <reference types="cypress" />

describe('FundrefContainer', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
  })

  it('id', () => {
    cy.visit('/doi.org/10.13039/100010367')
    cy.get('h3.member-results', { timeout: 30000 }).contains(
      'https://ror.org/052gg0110'
    )
  })

  it('name', () => {
    cy.visit('/doi.org/10.13039/100010367')
    cy.get('h3.member-results', { timeout: 30000 }).contains(
      'University of Oxford'
    )
  })

  it('not in ror', () => {
    cy.visit('/doi.org/10.13039/100011105', { failOnStatusCode: false })
    cy.get('h1').contains('404')
    cy.get('h2').contains('This page could not be found.')
  })

  // it('actions', () => {
  //   cy.get('.actions', { timeout: 30000 })
  //   .should(($action) => {
  //     expect($action).to.have.length.at.least(3)
  //   })
  // })
})

export {}
