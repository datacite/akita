/// <reference types="cypress" />

describe("PersonContainer", () => {
  beforeEach(() => {
    cy.visit(`/people/${encodeURIComponent('0000-0003-3484-6875')}`)
  })

  it("visit 0000-0003-3484-6875", () => {
    cy.get('h2.member-results',  { timeout: 20000 })
      .contains('K. J. Garza')
      .should('be.visible')
  })

})
