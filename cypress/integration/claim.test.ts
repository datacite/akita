describe('Claim', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.setCookie('_datacite', Cypress.env('userCookie'), { log: false })
  })

  it('claim list', () => {
    cy.visit('/orcid.org/0000-0001-6528-2027')
      .get('.panel.work-list', { timeout: 30000 })
      .should(($work) => {
        expect($work).to.have.length.at.least(1)
        expect($work.eq(0)).to.contain('Example for related items')
      })
  })

  it('single claim', () => {
    cy.visit('/doi.org/10.70048/2603202113012')
      .get('.panel.work-list', { timeout: 30000 })
      .contains('Example for related items')
  })

  // it('single claim claim section', () => {
  //   cy.visit('/doi.org/10.70048/2603202113012')
  //     .get('.panel.claim .label-danger', { timeout: 30000 })
  //     .contains('Claim failed')
  // })
})

export {}
