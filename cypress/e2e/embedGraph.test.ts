describe('Embed Related Aggregate Graph', () => {
  it('should render minimal layout with no footer for embed route', () => {
    cy.visit('/embed/related-aggregate/10.7272/q6g15xs4')
    
    // Check that there's only one div directly in the body
    cy.get('body > div:not([hidden])').should('have.length', 1)
    
    // Check that there's no footer
    cy.get('footer').should('not.exist')
  })
})
