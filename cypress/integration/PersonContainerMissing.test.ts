describe('PersonContainer missing ORCID ID', () => {
  before(() => {
    cy.visit(`/orcid.org/xxxxx`)
  })

  it('visit orcid.org/xxxxx', () => {
    cy.get('.alert p', { timeout: 10000 }).contains('Record not found')
  })
})

export {}
