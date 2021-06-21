describe('workContainer with usage', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(`/doi.org/${encodeURIComponent('10.5061/dryad.585qk')}`)
  })

  it('creators', () => {
    cy.get('.creator .creator-list', { timeout: 30000 })
      .should('have.length', 2)
      .should('contain', 'J. David Aguirre')
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
        'Data from: Does genetic diversity reduce sibling competition'
      )
  })

  it('chart', () => {
    cy.get('.mark-rect > path', { timeout: 30000 })
      .should('be.visible')
  })
})

describe('workContainer with funding', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(
      `/doi.org/${encodeURIComponent('10.5438/6423')}`
    )
  })

  it('creators', () => {
    cy.get('.creator .creator-list', { timeout: 30000 })
      .should('contain', 'Kristian Garza')
  })

  it('contributors', () => {
    cy.get('.contributor .contributor-list', { timeout: 30000 })
      .should('contain', 'The British Library')
  })

  it('funding', () => {
    cy.get('#work-funding', { timeout: 30000 }).contains('Funding')
    cy.get('.panel.funding .funder-list').should('contain', 'European Commission')
  })
})

export {}
