describe('Overview', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit('/overview')
  })

  it('header', () => {
    cy.get('.member', { timeout: 30000 }).contains('Overview')
  })

  it('data-sources', () => {
    cy.get('#data-sources .member-results', { timeout: 30000 }).contains(
      'Data Sources'
    )
  })

  it('works', () => {
    cy.get('#works .member-results', { timeout: 30000 }).contains('Works')
  })
})

export {}
