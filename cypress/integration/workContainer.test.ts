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

//TODO: Redo when data is available
// describe("DoiContainer with usage", () => {
//   before(() => {
//     cy.visit(`/doi.org/${encodeURIComponent('10.70048/findable101')}`)
//   })

//   it("chart", () => {
//     cy.get('.mark-rect > path',  { timeout: 10000 })
//     .should('be.visible')
//     .should('have.length', 4)
//   })
// })

export {}
