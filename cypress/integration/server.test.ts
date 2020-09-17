// describe("Server error", () => {  
//   beforeEach(() => {
//     cy.setCookie('_consent', 'true')
//     cy.route2('POST', '**/graphql', {
//       "errors": [
//         {
//           "message": "Internal Server Error"
//         }
//       ]
//     })a
//   })

//   it('search works', () => {
//     cy.visit('/doi.org')
//     cy.get('input[name="query"]')
//       .type('hallett{enter}')
//       .get('.alert > h4')
//       .should('contain', 'An error occured.')
//       .get('.alert > p')
//       .should('contain', 'Internal Server Error')
//   })

//   // it('search people', () => {
//   //   cy.visit('/orcid.org')
//   //   cy.get('input[name="query"]')
//   //     .type('hallett{enter}')
//   //     .get('.alert > h4')
//   //     .should('contain', 'An error occured.')
//   //     .get('.alert > p')
//   //     .should('contain', 'Internal Server Error')
//   // })

//   // it('search organizations', () => {
//   //   cy.visit('/ror.org')
//   //   cy.get('input[name="query"]')
//   //     .type('cambridge{enter}')
//   //     .get('.alert > h4')
//   //     .should('contain', 'An error occured.')
//   //     .get('.alert > p')
//   //     .should('contain', 'Internal Server Error')
//   // })
// })

export {}
