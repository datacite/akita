describe("Organizations", () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit("/organizations")
  })

  it("header", () => {
    cy.get('.member', { timeout: 30000 })
      .contains('Organizations')
  })

  it("associations", () => {
    cy.get('#associations .member-results', { timeout: 30000 })
      .contains('Associations')
  })

  it("citations", () => {
    cy.get('#citations .member-results', { timeout: 30000 })
      .contains('Citations and Usage')
  })
})

export {}
