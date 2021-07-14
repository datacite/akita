/// <reference types="cypress" />

describe('PersonContainer', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(`/orcid.org/${encodeURIComponent('0000-0001-6528-2027')}`)
  })

  it('id', () => {
    cy.get('h3.member-results', { timeout: 30000 }).contains(
      'https://orcid.org/0000-0001-6528-2027'
    )
  })

  it('name', () => {
    cy.get('.panel-body h3.work', { timeout: 30000 }).contains('Martin Fenner')
  })

  // it('employment', () => {
  //   cy.get('#person-employment', { timeout: 30000 }).contains('Employment')
  //   cy.get('.panel.employment').should(($employment) => {
  //     expect($employment).to.have.length(1)
  //     expect($employment.eq(0)).to.contain('DataCite')
  //     expect($employment.eq(0)).to.contain('Since August 2016')
  //   })
  // })

  it('links', () => {
    cy.get('.people-links').should(($link) => {
      expect($link).to.have.length(1)
      expect($link.eq(0)).to.contain('Blog')
    })
  })

  it('identifiers', () => {
    cy.get('.people-identifiers').should(($id) => {
      expect($id).to.have.length.at.least(1)
      expect($id.eq(0)).to.contain('GitHub')
    })
  })

  it('tags', () => {
    cy.get('.tags').contains('Germany')
  })

  // it('actions', () => {
  //   cy.get('.actions', { timeout: 30000 })
  //   .should(($action) => {
  //     expect($action).to.have.length.at.least(3)
  //   })
  // })

  it('other profiles', () => {
    cy.get('#profile-orcid').contains('ORCID').should('be.visible')
    cy.get('#profile-orcid a')
      .should('have.attr', 'href')
      .should('eq', 'https://orcid.org/0000-0001-6528-2027')
    cy.get('#profile-impactstory').contains('Impactstory').should('be.visible')
    cy.get('#profile-impactstory a')
      .should('have.attr', 'href')
      .should('eq', 'https://profiles.impactstory.org/u/0000-0001-6528-2027')
    cy.get('#profile-europepmc').contains('Europe PMC').should('be.visible')
    cy.get('#profile-europepmc a')
      .should('have.attr', 'href')
      .should('eq', 'https://europepmc.org/authors/0000-0001-6528-2027')
  })

  it('facets', () => {
    cy.get('#published-facets').should('be.visible')
    cy.get('#published-facets > li').should(($facets) => {
      expect($facets).to.have.length.at.least(1)
    })
    cy.get('#work-type-facets').should('be.visible')
    cy.get('#work-type-facets > li').should(($facets) => {
      expect($facets).to.have.length.at.least(1)
    })
    cy.get('#registration-agency-facets').should('be.visible')
    cy.get('#registration-agency-facets > li').should(($facets) => {
      expect($facets).to.have.length.at.least(1)
    })
  })

  it('production chart', () => {
    cy.get('.mark-rect > path').should('be.visible').should('have.length.gt', 0)
  })

  it('types chart', () => {
    cy.get('.mark-arc > path').should('be.visible').should('have.length.gt', 1)
  })
})

export {}
