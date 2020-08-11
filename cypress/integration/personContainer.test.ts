/// <reference types="cypress" />

describe("PersonContainer", () => {
  beforeEach(() => {
    cy.visit(`/people/${encodeURIComponent('0000-0003-3484-6875')}`)
  })

  it("id", () => {
    cy.get('h3.member-results',  { timeout: 30000 })
      .contains('https://orcid.org/0000-0003-3484-6875')
  })

  it("name", () => {
    cy.get('.panel-body h3.work',  { timeout: 30000 })
      .contains('K. J. Garza')
  })

  it("share", () => {
    cy.get('.share-button', { timeout: 30000 }).should(($btn) => {
      expect($btn).to.have.length(3)
      expect($btn.eq(0)).to.be.visible
      expect($btn.eq(1)).to.be.visible
      expect($btn.eq(2)).to.be.visible
    })
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

  it("facets", () => {
    cy.get('#published-facets')
      .should('be.visible')
    cy.get('#published-facets > li').should(($facets) => {
        expect($facets).to.have.length.at.least(1)
      })
    cy.get('#work-type-facets')
    .should('be.visible')
    cy.get('#work-type-facets > li').should(($facets) => {
      expect($facets).to.have.length.at.least(2)
    })
    cy.get('#repository-facets')
    .should('not.be.visible')
  })
})
