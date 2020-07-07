describe("PersonContainer", () => {
  beforeEach(() => {
    cy.visit(`/person/${encodeURIComponent('0000-0003-3484-6875')}`)
  })

  it("visit 0000-0003-3484-6875", () => {
    cy.get('h2.member-results',  { timeout: 10000 })
      .contains('K. J. Garza')
      .should('be.visible')
  })

})
