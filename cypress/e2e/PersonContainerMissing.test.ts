describe('PersonContainer missing ORCID ID', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(`/orcid.org/xxxxx`)
  })

  it('visit orcid.org/xxxxx', () => {
    cy.get('h1').contains('404')
    cy.get('h2').contains('This page could not be found.')
  })
})

export {}
