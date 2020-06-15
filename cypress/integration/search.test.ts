describe("Search", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("search no query", () => {
    cy.get('input[name="query"]')
      // return introduction text
      .get('.member')
      .should('contain', 'Introduction')
  })

  it("search for hallett", () => {
    cy.get('input[name="query"]')
      .type('hallett')
      // timeout for the query results to return
      .get('.member-results', { timeout: 10000 })
      .should('contain', 'Results')
      // results are rendered
      .get('.panel.content-item').should(($contentItem) => {
        expect($contentItem).to.have.length(25)
      })
      // all facets are rendered
      .get('.panel.facets').should(($facet) => {
        expect($facet).to.have.length(3)
        expect($facet.eq(0)).to.contain('Publication Year')
        expect($facet.eq(1)).to.contain('Content Type')
        expect($facet.eq(2)).to.contain('DOI Registration Agency')
      })
  })

  // it("search for specific doi", () => {
  //   cy.get('input[name="query"]')
  //     .type('10.80225/da52-7919')
  //     // no results count for single result
  //     .get('.member-results', { timeout: 10000 }).should('not.exist')
  //     // the results are rendered
  //     .get('.panel.content-item').should(($contentItem) => {
  //       expect($contentItem).to.have.length(1)
  //       expect($contentItem.eq(0)).to.contain('Version 1.0 of Content published 2020 via DataCite')
  //     })
  //     // all facets are rendered
  //     .get('.panel.facets').should(($facet) => {
  //       expect($facet).to.have.length(3)
  //       expect($facet.eq(0)).to.contain('Publication Year')
  //       expect($facet.eq(1)).to.contain('Content Type')
  //       expect($facet.eq(2)).to.contain('DOI Registration Agency')
  //     })
  // })

  it("search with no results", () => {
    cy.get('input[name="query"]')
      .type('xxxxxxxxxxxx')
      // timeout for the query results to return
      .get('.alert-warning', { timeout: 5000 })
      .should('contain', 'No content found.')
      // no results count for zero results
      .get('.member-results').should('not.exist')
      // no facet for zero results
      .get('.panel.facets').should('not.exist')
  })

  // it("search and use facets", () => {
  //   cy.get('input[name="query"]')
  //     .type('hallett')
  //     .get(':nth-child(2) > .panel-body > ul > :nth-child(2) > a', { timeout: 10000 })
  //     .click()
  //     // timeout for the query results to return
  //     .get('.member-results')
  //     .should('contain', 'Results')
  //     .get(':nth-child(3) > .panel-body > ul > :nth-child(1) > a').click()
  //     // timeout for the query results to return
  //     .get('.member-results')
  //     .should('contain', 'Results')
  //     // all facets are rendered
  //     .get('.panel.facets').should(($facet) => {
  //       expect($facet).to.have.length(3)
  //       expect($facet.eq(0)).to.contain('Publication Year')
  //       expect($facet.eq(1)).to.contain('Content Type')
  //       expect($facet.eq(2)).to.contain('DOI Registration Agency')
  //     })
  // })

  it("search with pagination", () => {
    cy.get('input[name="query"]')
      .type('hallett')
      .get('.member-results', { timeout: 10000 })
      .should('contain', 'Results')
      .get('.page-number > a').click()
      // timeout for the query results to return
      .get('.member-results', { timeout: 10000 })
      .should('contain', 'Results')
      // all facets are rendered
      .get('.panel.facets').should(($facet) => {
        expect($facet).to.have.length(3)
        expect($facet.eq(0)).to.contain('Publication Year')
        expect($facet.eq(1)).to.contain('Content Type')
        expect($facet.eq(2)).to.contain('DOI Registration Agency')
      })
  })
})
