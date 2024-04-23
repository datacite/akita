describe('OrganizationContainer missing ROR ID', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(`/ror.org/xxxxx`, { failOnStatusCode: false })
  })

  it('visit ror.org/xxxxx', () => {
    cy.get('h1').contains('404')
    cy.get('h2').contains('This page could not be found.')
  })
})

export {}
