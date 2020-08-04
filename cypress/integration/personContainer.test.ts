/// <reference types="cypress" />

describe("PersonContainer", () => {
  beforeEach(() => {
    cy.visit(`/people/${encodeURIComponent('0000-0003-3484-6875')}`)
  })

  it("visit 0000-0003-3484-6875", () => {
    cy.get('h2.member-results',  { timeout: 30000 })
      .contains('K. J. Garza')
      .should('be.visible')
  })

  it("share", () => {
    cy.get('.share-button', { timeout: 30000 }).should(($btn) => {
      expect($btn).to.have.length(3)
      expect($btn.eq(0)).to.be.visible
      expect($btn.eq(1)).to.be.visible
      expect($btn.eq(2)).to.be.visible
    })
  })
})
