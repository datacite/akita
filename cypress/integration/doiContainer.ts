describe("DoiContainer", () => {
  beforeEach(() => {
    cy.visit(`/dois/${encodeURIComponent('10.5061/dryad.8jd18')}`)
  })

  it("visit 10.5061/dryad.8jd18", () => {
    cy.get('h3.work',  { timeout: 10000 })
      .contains('Data from: SNP discovery and gene annotation in the surf clam Mesodesma donacium')
      .should('be.visible')
  })

  it("export box", () => {
    cy.get('div#export-xml')
      // timeout for the query results to return
      .contains('DataCite XML')
      .should('be.visible')
  })
})

export {}
