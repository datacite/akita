describe("Search People", () => {
  beforeEach(() => {
    cy.visit("/orcid.org")
  })

  it("search no query", () => {
    cy.get('.alert-info')
      .should('contain', 'DataCite Support')
  })

  it("search for richard hallett", () => {
    cy.get('input[name="query"]')
      .type('richard hallett{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'People')
      // results are rendered
      .get('.panel-transparent').should(($person) => {
        expect($person).to.have.length.at.least(4)
      })
  })

  it("search and reset", () => {
    cy.get('input[name="query"]')
      .type('hallett{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      // results are found
      .should('contain', 'People')
      .get('#search-clear >').click()
      .get('input[name="query"]')
      .should('not.contain', 'hallett')
  })

  it("search for specific ORCID", () => {
    cy.get('input[name="query"]')
      .type('0000-0003-3484-6875{enter}')
      // the results are rendered
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'People')
      // results are rendered
      .get('.panel-transparent').should(($person) => {
        expect($person).to.have.length.at.least(4)
      })
  })

  it("search with no results", () => {
    cy.get('input[name="query"]')
      .type('xxxxxyyyyy{enter}')
      // timeout for the query results to return
      .get('.alert-warning', { timeout: 60000 })
      .should('contain', 'No people found.')
  })
})

export {}
