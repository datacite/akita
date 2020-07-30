describe("Search Person", () => {
  beforeEach(() => {
    cy.visit("/")
    cy.get('a#noanim-tab-example-tab-people')
    .click()
  })

  it("search no query", () => {
    cy.get('input[name="query"]', { timeout: 60000 })
      // return introduction text
      .get('.member')
      .should('contain', 'Introduction')
  })

  it("search for richard hallett", () => {
    cy.get('input[name="query"]')
      .type('richard hallett')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'Results')
      // results are rendered
      .get('.counter-list').should(($contentItem) => {
        expect($contentItem).length.to.be.gt(20)
      })
      // .get(':nth-child(2) > .panel-body > .registered')
      // .should('contain', 'DOI registered')
      // all facets are rendered
  })

  it("search and reset", () => {
    cy.get('input[name="query"]')
      .type('hallett')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      // results are found
      .should('contain', 'Results')
      .get('#search-clear >').click()
      // return introduction text
      .get('.member')
      .should('contain', 'Introduction')
  })

  // it("search for specific ORCID", () => {
  //   cy.get('input[name="query"]')
  //     .type('0000-0003-3484-6875')
  //     // the results are rendered
  //     .get('.panel-body .metadata', { timeout: 60000 })
  //     .should('contain', 'Article published 2016 via Apollo - University of Cambridge Repository (staging)' )
  //     .get('.panel-body .creators')
  //     .should('contain', 'Margaret L Westwater, Paul Fletcher & Hisham Ziauddeen')
  //     .get('.panel-body .registered')
  //     .should('contain', 'DOI registered August 19, 2016 via DataCite.')
  //     .get('.panel-body .description')
  //     .should('contain', 'Purpose As obesity rates continue to climb')
  //     .get('.panel-body .tags')
  //     .should('contain', 'Text')
  //     // no results count for single result
  //     .get('.member-results').should('not.exist')
  //     // all facets are rendered
  // })

  it("search with no results", () => {
    cy.get('input[name="query"]')
      .type(' ')
      // timeout for the query results to return
      // return introduction text
      .get('.member', { timeout: 60000 })
      .should('contain', 'Introduction')
  })

})
