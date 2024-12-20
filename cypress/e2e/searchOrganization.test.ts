describe('Search Organizations', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit('/ror.org')
  })

  it('search no query', () => {
    cy.get('.alert-info').should('contain', 'DataCite Support')
  })

  it('search for oxford', () => {
    cy.get('input[name="query"]')
      .type('oxford{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'Organizations')
      // results are rendered
      .get('.organization')
      .should(($organization) => {
        expect($organization).to.have.length.at.least(4)
      })

      // all facets are rendered
      .get('.facetlist-group')
      .children()
      .should(($facet) => {
        expect($facet).to.have.length.at.least(2)
        // expect($facet.eq(0)).to.contain('Country')
        // expect($facet.eq(1)).to.contain('Organization Type')
      })
  })

  it('search for specific ror id', () => {
    cy.get('input[name="query"]')
      .type('ror.org/052gg0110{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'Organization')
      // results are rendered
      .get('.organization')
      .should(($organization) => {
        expect($organization).to.have.length.at.least(1)
      })

      // all facets are rendered
      .get('.facetlist-group')
      .children()
      .should(($facet) => {
        expect($facet).to.have.length.at.least(2)
        // expect($facet.eq(0)).to.contain('Country')
        // expect($facet.eq(1)).to.contain('Organization Type')
      })
  })

  it('search and reset', () => {
    cy.get('input[name="query"]')
      .type('oxford{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      // results are found
      .should('contain', 'Organizations')
      .get('#search-clear >')
      .click()
      .get('input[name="query"]')
      .should('not.contain', 'oxford')
  })

  it('search with no results', () => {
    cy.get('input[name="query"]')
      .type('xxx{enter}')
      // timeout for the query results to return
      // return introduction text
      .get('.alert-warning', { timeout: 60000 })
      .should('contain', 'No organizations found.')
  })
})

export {}
