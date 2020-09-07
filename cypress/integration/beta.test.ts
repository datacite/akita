describe("Beta", () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit("/beta")
  })

  it("header", () => {
    cy.get('.member', { timeout: 30000 })
      .contains('Beta Tester Program')
  })
})

export {}
