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

  it("chage cite as", () => {
    cy.get('select.cite-as')
      .select('ieee')
      // timeout for the query results to return
      .get('.formatted-citation', { timeout: 10000 }).contains('C. Gallardo-Escárate, V. Valenzuela-Muñoz, G. Núñez-Acuña, and P. Haye, “Data from: SNP discovery and gene annotation in the surf clam Mesodesma donacium.” Dryad, 2014, doi: 10.5061/DRYAD.8JD18.')
      })
})

export {}
