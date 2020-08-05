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

  it("other profiles", () => {
    cy.get('#profile-orcid')
      .contains('ORCID')
      .should('be.visible')
    cy.get('#profile-orcid a')
      .should('have.attr', 'href')
      .should('eq', "https://orcid.org/0000-0003-3484-6875")
    cy.get('#profile-impactstory')
      .contains('Impactstory')
      .should('be.visible')
    cy.get('#profile-impactstory a')
      .should('have.attr', 'href')
      .should('eq', "https://profiles.impactstory.org/u/0000-0003-3484-6875")
    cy.get('#profile-europepmc')
      .contains('Europe PMC')
      .should('be.visible')
    cy.get('#profile-europepmc a')
      .should('have.attr', 'href')
      .should('eq', "http://europepmc.org/authors/0000-0003-3484-6875")
  })
})
