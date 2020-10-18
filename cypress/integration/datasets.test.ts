describe('Datasets', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit('/datasets')
  })

  it('header', () => {
    cy.get('.member', { timeout: 30000 }).contains('Datasets')
  })

  it('citations', () => {
    cy.get('#citations .member-results', { timeout: 30000 }).contains(
      'Citations and Usage'
    )
  })
})

export {}
