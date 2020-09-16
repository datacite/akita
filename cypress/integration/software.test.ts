describe("Software", () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit("/software")
  })

  it("header", () => {
    cy.get('.member', { timeout: 30000 })
      .contains('Software')
  })

  it("citations", () => {
    cy.get('#citations .member-results', { timeout: 30000 })
      .contains('Citations and Usage')
  })

  it("connections", () => {
    cy.get('#connections .member-results', { timeout: 30000 })
      .contains('Connections')
  })
})

export {}
