describe("DoiContainer", () => {
  beforeEach(() => {
    cy.visit(`/dois/${encodeURIComponent('10.17863/cam.330')}`)
  })

  it("visit 10.17863/cam.330", () => {
    cy.get('h3.work',  { timeout: 10000 })
      .contains('Sugar Addiction: The State of the Science ')
      .should('be.visible')
  })

  it("license", () => {
    cy.get('.license a')
      .should('have.attr', 'href').and('include', 'creativecommons.org')
      .should('be.visible')
  })

  it("export box", () => {
    cy.get('div#export-xml')
      .contains('DataCite XML')
      .should('be.visible')
  })

  it("cite as", () => {
    cy.get('select.cite-as')
      .select('ieee')
      // timeout for the query results to return
      .get('.formatted-citation', { timeout: 10000 })
      .should('be.visible')
      //.contains('CXC-DS, “Chandra X-ray Observatory ObsId 1.”')
  })
})
