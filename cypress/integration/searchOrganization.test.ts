describe("Search Organizations", () => {
  beforeEach(() => {
    cy.visit("/")
    cy.get('a#organizations-link')
    .click()
  })

  it("search no query", () => {
    cy.get('input[name="query"]', { timeout: 60000 })
      // return introduction text
      .get('.member')
      .should('contain', 'Introduction')
  })

  it("search for oxford", () => {
    cy.get('input[name="query"]')
      .type('oxford{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'Organizations')
      // results are rendered
      .get('.panel-transparent').should(($organization) => {
        expect($organization).to.have.length.at.least(4)
      })

      // all facets are rendered
      .get('.panel.facets').should(($facet) => {
        expect($facet).to.have.length.at.least(2)
        // expect($facet.eq(0)).to.contain('Country')
        // expect($facet.eq(1)).to.contain('Organization Type')
      })
  })

  it("search for specific ror id", () => {
    cy.get('input[name="query"]')
      .type('ror.org/052gg0110{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'Organizations')
      // results are rendered
      .get('.panel-transparent').should(($organization) => {
        expect($organization).to.have.length.at.least(4)
      })

      // all facets are rendered
      .get('.panel.facets').should(($facet) => {
        expect($facet).to.have.length.at.least(2)
        // expect($facet.eq(0)).to.contain('Country')
        // expect($facet.eq(1)).to.contain('Organization Type')
      })
  })

  it("search and reset", () => {
    cy.get('input[name="query"]')
      .type('oxford{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      // results are found
      .should('contain', 'Organizations')
      .get('#search-clear >').click()
      // return introduction text
      .get('.member')
      .should('contain', 'Introduction')
  })

  it("search with no results", () => {
    cy.get('input[name="query"]')
      .type('xxx{enter}')
      // timeout for the query results to return
      // return introduction text
      .get('.alert-warning', { timeout: 60000 })
      .should('contain', 'No organizations found.')
  })
})
