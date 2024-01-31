describe('OrganizationContainer missing ROR ID', () => {
  before(() => {
    cy.visit(`/ror.org/xxxxx`)
      .get('#rcc-confirm-button').click()
  })

  it('visit ror.org/xxxxx', () => {
    cy.get('.alert p', { timeout: 10000 }).contains('Record not found')
  })
})

export {}
