Cypress.Commands.add('typeHeaderSearchAfterNav', (navSelector, expectedPathname, query) => {
  cy.get(navSelector).click()
  cy.location('pathname').should('eq', expectedPathname)
  cy.get('input[name="query"]')
    .should('be.visible')
    .clear()
    .type(query)
    .should('have.value', query)
})
