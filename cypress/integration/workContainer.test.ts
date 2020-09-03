// describe('WorkContainer', () => {
//   before(() => {
//     cy.visit(`/doi.org/${encodeURIComponent('10.4224/crm.2012e.cass-5')}`)
//   })

//   it('visit 10.4224/crm.2012e.cass-5', () => {
//     cy.get('h3.work', { timeout: 10000 })
//       .contains(
//         'CASS-5: Nearshore seawater reference material for trace metals'
//       )
//       .should('be.visible')
//   })

//   it('export box', () => {
//     cy.get('div#export-xml', { timeout: 30000 })
//       // timeout for the query results to return
//       .contains('DataCite XML')
//       .should('be.visible')
//   })

//   it('cite as', () => {
//     cy.get('select.cite-as')
//       .select('ieee')
//       // timeout for the query results to return
//       .get('.formatted-citation', { timeout: 30000 })
//       .should('be.visible')
//     //.contains('CXC-DS, “Chandra X-ray Observatory ObsId 1.”')
//   })

//   // it("chart", () => {
//   //   cy.get('.mark-rect > path')
//   //   .should('be.visible')
//   //   .should('have.length', 4)
//   // })
// })

describe('workContainer with usage', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(`/doi.org/${encodeURIComponent('10.70048/findable101')}`)
  })

  it('chart', () => {
    cy.get('.mark-rect > path', { timeout: 10000 })
      .should('be.visible')
      .should('have.length', 4)
  })
})

describe('workContainer with funding', () => {
  before(() => {
    cy.setCookie('_consent', 'true')
    cy.visit(`/doi.org/${encodeURIComponent('10.70131/test_doi_5d2bc48749f14')}`)
  })

  it('funding', () => {
    cy.get('#work-funding', { timeout: 30000 }).contains('Funding')
    cy.get('.panel.funding').should(($funding) => {
      expect($funding).to.have.length(2)
      expect($funding.eq(0)).to.contain('Water Ice')
      expect($funding.eq(1)).to.contain('ARC')
    })
  })
})

export {}
