describe('WorkContainer missing DOI', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit('/doi.org/10.4224/xxxxx')
  })

  it('visit 10.4224/xxxxx', () => {
    cy.get('h1').contains('404')
    cy.get('h2').contains('This page could not be found.')
  })
})

export {}
