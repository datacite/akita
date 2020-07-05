describe("DoiContainer", () => {
  beforeEach(() => {
    cy.visit(`/dois/${encodeURIComponent('10.70048/q3sn-h087')}`)
  })

  it("visit 10.70048/q3sn-h087", () => {
    cy.get('h3.work', { timeout: 30000 })
      .contains('Chandra X-ray Observatory ObsId 1')
      .should('be.visible')
  })

  it("export box", () => {
    cy.get('div#export-xml', { timeout: 30000 })
      // timeout for the query results to return
      .contains('DataCite XML')
      .should('be.visible')
  })

  it("cite as", () => {
    cy.get('select.cite-as')
      .select('ieee')
      // timeout for the query results to return
      .get('.formatted-citation', { timeout: 30000 })
      .should('be.visible')
      //.contains('CXC-DS, “Chandra X-ray Observatory ObsId 1.”')
      })
})
