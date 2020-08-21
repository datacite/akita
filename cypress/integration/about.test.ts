describe("About", () => {
  beforeEach(() => {
    cy.visit("/about")
  })

  it("header", () => {
    cy.get('.member', { timeout: 30000 })
      .contains('About')
  })
})

export {}
