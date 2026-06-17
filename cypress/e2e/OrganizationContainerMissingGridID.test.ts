describe('Organization page GRID identifier', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
  })

  it('shows the GRID identifier when organization has a GRID id', () => {
    cy.visit('/ror.org/052gg0110')
    cy.get('#ror-link', { timeout: 10000 })
      .should('have.attr', 'href', 'https://ror.org/052gg0110')
    cy.get('[data-testid="grid-identifier"]').should('contain.text', 'GRID')
  })

  it('does not show the GRID identifier when organization has no GRID id', () => {
    cy.visit('/ror.org/02hhf2525')
    cy.get('#ror-link', { timeout: 10000 })
      .should('have.attr', 'href', 'https://ror.org/02hhf2525')
    cy.get('body').find('[data-testid="grid-identifier"]').should('not.exist')
  })
})

export {}
