describe("People", () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit("/people")
  })

  it("header", () => {
    cy.get('.member', { timeout: 30000 })
      .contains('People')
  })

  it("citations", () => {
    cy.get('#citations .member-results', { timeout: 30000 })
      .contains('Citations and Usage')
  })
})

export {}
