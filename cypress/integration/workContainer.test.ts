describe('workContainer with usage', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(`/doi.org/${encodeURIComponent('10.70048/findable101')}`)
  })

  it('creators', () => {
    cy.get('.creator .creator-list', { timeout: 30000 })
      .should('have.length', 1)
      .should('contain', 'DataCite Metadata Working Group')
  })

  it('contributors', () => {
    cy.get('.contributor .contributor-list', { timeout: 30000 })
      .should('have.length', 17)
      .should('contain', 'Joan Starr')
  })

  it('share', () => {
    cy.get('.share .share-list', { timeout: 30000 })
      .should('have.length', 1)
      .should('contain', 'Email')
  })

  it('download', () => {
    cy.get('.download .download-list', { timeout: 30000 })
      .should('have.length', 2)
      .should('contain', 'DataCite XML')
  })

  it('cite as', () => {
    cy.get('.cite-as')
      .select('ieee')
      .get('.formatted-citation', { timeout: 30000 })
      .should(
        'contain',
        'DataCite Metadata Schema Documentation for the Publication and Citation of Research Data v4.0.'
      )
  })

  it('chart', () => {
    cy.get('.mark-rect > path', { timeout: 30000 })
      .should('be.visible')
      .should('have.length', 4)
  })
})

describe('workContainer with funding', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(
      `/doi.org/${encodeURIComponent('10.70131/test_doi_5d2bc48749f14')}`
    )
  })

  it('creators', () => {
    cy.get('.creator .creator-list', { timeout: 30000 })
      .should('have.length', 2)
      .should('contain', 'Jim Banks')
  })

  it('contributors', () => {
    cy.get('.contributor .contributor-list', { timeout: 30000 })
      .should('have.length', 2)
      .should('contain', 'The Editor')
  })

  it('funding', () => {
    cy.get('#work-funding', { timeout: 30000 }).contains('Funding')
    cy.get('.panel.funding .funder-list').should(($funding) => {
      expect($funding).to.have.length(2)
      expect($funding.eq(0)).to.contain('Water Ice')
      expect($funding.eq(1)).to.contain('ARC')
    })
  })
})
