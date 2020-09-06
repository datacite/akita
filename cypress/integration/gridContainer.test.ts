/// <reference types="cypress" />

describe("GridContainer", () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.visit('/grid.ac/institutes/grid.4991.5')
  })

  it("id", () => {
    cy.get('h3.member-results',  { timeout: 30000 })
      .contains('https://ror.org/052gg0110')
  })

  it("name", () => {
    cy.get('.panel-body h3.work',  { timeout: 30000 })
      .contains('University of Oxford')
  })

  // it('actions', () => {
  //   cy.get('.actions', { timeout: 30000 })
  //   .should(($action) => {
  //     expect($action).to.have.length.at.least(3)
  //   })
  // })
})

export {}
