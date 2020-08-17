describe("Search Works", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("search no query", () => {
    cy.get('input[name="query"]', { timeout: 60000 })
      // return introduction text
      .get('.member')
      .should('contain', 'Introduction')
  })

  it("search for climate", () => {
    cy.get('input[name="query"]')
      .type('climate{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'Works')
      // results are rendered
      .get('.panel-transparent').should(($contentItem) => {
        expect($contentItem).to.have.length.at.least(14)
      })
      // .get(':nth-child(2) > .panel-body > .registered')
      // .should('contain', 'DOI registered')
      // all facets are rendered
      .get('.panel.facets').should(($facet) => {
        expect($facet).to.have.length.at.least(3)
        expect($facet.eq(0)).to.contain('Publication Year')
        expect($facet.eq(1)).to.contain('Work Type')
        expect($facet.eq(2)).to.contain('Field of Science')
        expect($facet.eq(3)).to.contain('License')
        expect($facet.eq(4)).to.contain('Language')
        expect($facet.eq(5)).to.contain('DOI Registration Agency')
      })
  })

  it("search and reset", () => {
    cy.get('input[name="query"]', { timeout: 60000 })
      .type('climate{enter}')
      // timeout for the query results to return
      .get('.member-results', { timeout: 60000 })
      // results are found
      .should('contain', 'Works')
      .get('#search-clear >').click()
      .get('input[name="query"]')
      .should('not.contain', 'climate')
  })

  it("search for specific doi", () => {
    cy.get('input[name="query"]')
      .type('10.17863/cam.330{enter}')
      // the results are rendered
      .get('.panel-body .metadata', { timeout: 60000 })
      .should('contain', 'Article published 2016 via Apollo - University of Cambridge Repository (staging)' )
      .get('.panel-body .creators')
      .should('contain', 'Margaret L Westwater, Paul Fletcher & Hisham Ziauddeen')
      .get('.panel-body .registered')
      .should('contain', 'DOI registered August 19, 2016 via DataCite.')
      .get('.panel-body .description')
      .should('contain', 'Purpose As obesity rates continue to climb')
      .get('.panel-body .tags')
      .should('contain', 'Text')
      // no results count for single result
      .get('.member-results', { timeout: 60000 })
      .should('contain', 'Work')
      // all facets are rendered
      .get('.panel.facets').should(($facet) => {
        expect($facet).to.have.length(5)
        expect($facet.eq(0)).to.contain('Publication Year')
        expect($facet.eq(1)).to.contain('Work Type')
        expect($facet.eq(2)).to.contain('License')
        expect($facet.eq(3)).to.contain('Language')
        expect($facet.eq(4)).to.contain('DOI Registration Agency')
      })
  })

  it("search with no results", () => {
    cy.get('input[name="query"]')
      .type('xxxxxxxxxxxx{enter}')
      // timeout for the query results to return
      .get('.alert-warning', { timeout: 60000 })
      .should('contain', 'No works found.')
      // no results count for zero results
      .get('.member-results').should('not.exist')
      // no facet for zero results
      .get('.panel.facets').should('not.exist')
  })

  // it("search and use facets", () => {
  //   cy.get('input[name="query"]')
  //     .type('hallett')
  //     .get(':nth-child(2) > .panel-body > ul > :nth-child(2) > a', { timeout: 60000 })
  //     .click()
  //     // timeout for the query results to return
  //     .get('.member-results')
  //     .should('contain', 'Results')
  //     .get(':nth-child(3) > .panel-body > ul > :nth-child(1) > a')
  //     .click()
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

  // it("search and filter by license", () => {
  //   cy.get('input[name="query"]')
  //     .type('science')
  //     .get(':nth-child(2) > .panel-body > ul > :nth-child(4) > a', { timeout: 60000 })
  //     .click()
  //     .get('.member-results')
  //     .should('contain', 'Results')
  //     // all facets are rendered
  //     .get('.panel.facets').should(($facet) => {
  //       expect($facet).to.have.length(6)
  //       expect($facet.eq(0)).to.contain('Publication Year')
  //       expect($facet.eq(1)).to.contain('Content Type')
  //       expect($facet.eq(2)).to.contain('Field of Science')
  //       expect($facet.eq(3)).to.contain('License')
  //       expect($facet.eq(4)).to.contain('Language')
  //       expect($facet.eq(5)).to.contain('DOI Registration Agency')
  //     })
  // })

  // it("search with pagination", () => {
  //   cy.get('input[name="query"]')
  //     .type('hallett')
  //     .get('.member-results', { timeout: 60000 })
  //     .should('contain', 'Results')
  //     .get('.pager > :nth-child(2) > a').click()
  //     // timeout for the query results to return
  //     .get('.member-results', { timeout: 60000 })
  //     .should('contain', 'Results')
  //     // all facets are rendered
  //     .get('.panel.facets').should(($facet) => {
  //       expect($facet).to.have.length(4)
  //       expect($facet.eq(0)).to.contain('Publication Year')
  //       expect($facet.eq(1)).to.contain('Content Type')
  //       expect($facet.eq(2)).to.contain('Language')
  //       expect($facet.eq(3)).to.contain('DOI Registration Agency')
  //     })
  // })
})
