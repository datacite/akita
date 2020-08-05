describe("DoiContainer", () => {
  before(() => {
    cy.visit(`/dois/${encodeURIComponent('10.17863/cam.330')}`)
  })

  it("visit 10.17863/cam.330", () => {
    cy.get('h3.work', { timeout: 10000 })
      .contains('Sugar Addiction: The State of the Science')
      .should('be.visible')
  })

  it("license", () => {
    cy.get('.license', { timeout: 30000 })
      .should('be.visible')
  })

  it("export box", () => {
    cy.get('div#export-xml', { timeout: 30000 })
      // timeout for the query results to return
      .contains('DataCite XML')
      .should('be.visible')
  })

  it("share", () => {
    cy.get('.share-button', { timeout: 30000 }).should(($btn) => {
      expect($btn).to.have.length(3)
      expect($btn.eq(0)).to.be.visible
      expect($btn.eq(1)).to.be.visible
      expect($btn.eq(2)).to.be.visible
    })
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
