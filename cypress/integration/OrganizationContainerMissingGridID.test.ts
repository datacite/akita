describe('OrganizationContainer Display GridID if it exists', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
  })
  it('visit site with gridID, id element should exist', () => {
    cy.visit('/ror.org/052gg0110')
    cy
      .get('.identifier').first()
      .should('include.text','GRID')
  })
  it('visit site without gridID, id element not should exist', () => {
    cy.visit('/ror.org/02hhf2525')
    cy
      .get('.identifier')
      .should('not.include.text','GRID')
  })
})

export {}
