describe('WorkContainer missing DOI', () => {
  before(() => {
    cy.visit(`/doi.org/${encodeURIComponent('10.4224/xxxxx')}`)
  })

  it('visit 10.4224/xxxxx', () => {
    cy.get('.alert p', { timeout: 10000 }).contains('Record not found')
  })
})

export {}
