describe("About", () => {
  beforeEach(() => {
    cy.visit("/about")
  })

  it("header", () => {
    cy.get('h2.member"]', { timeout: 30000 })
      .should('eq', 'About')
  })
})
