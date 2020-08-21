describe('WorkContainer', () => {
  before(() => {
    cy.visit(`/doi.org/${encodeURIComponent('10.4224/xxxxx')}`)
  })

  it('visit 10.4224/xxxxx', () => {
    cy.get('h3.work', { timeout: 10000 })
      .contains(
        'CASS-5: Nearshore seawater reference material for trace metals'
      )
      .should('be.visible')
  })
})
