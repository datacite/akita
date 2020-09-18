describe("Organizations", () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit("/organizations")
  })

  it("header", () => {
    cy.get('.member', { timeout: 30000 })
      .contains('Organizations')
  })

  it("connections", () => {
    cy.get('#connections .member-results', { timeout: 30000 })
      .contains('Connections')
  })

  it("citations", () => {
    cy.get('#citations .member-results', { timeout: 30000 })
      .contains('Citations and Usage')
  })
})

export {}
