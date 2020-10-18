describe('Claim', () => {
  beforeEach(() => {
    cy.setCookie('_consent', 'true')
    cy.setCookie('_datacite', Cypress.env('USER_COOKIE'), { log: false })
  })

  it('claim list', () => {
    cy.visit('/orcid.org/0000-0003-1419-2405')
      .get('.panel.work-list', { timeout: 30000 })
      .should(($work) => {
        expect($work).to.have.length.at.least(20)
        expect($work.eq(0)).to.contain('Claim failed')
      })
  })

  it('single claim', () => {
    cy.visit('/doi.org/10.80225/da52-7919')
      .get('.tags .label-danger', { timeout: 30000 })
      .contains('Claim failed')
  })

  it('single claim claim section', () => {
    cy.visit('/doi.org/10.80225/da52-7919')
      .get('.panel.claim .label-danger', { timeout: 30000 })
      .contains('Claim failed')
  })
})

export {}
