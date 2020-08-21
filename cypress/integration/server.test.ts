describe("Server error", () => {  
  beforeEach(() => {
    cy.server()
    cy.route({
      url: 'https://api.stage.datacite.org/graphql',
      method: 'POST',
      status: 200,
      response: {
        "errors": [
          {
            "message": "Internal Server Error"
          }
        ]
      }
    })
  })

  // it('search works', () => {
  //   cy.visit('/')
  //   cy.get('input[name="query"]')
  //     .type('hallett{enter}')
  //     .get('.alert > h4')
  //     .should('contain', 'An error occured.')
  //     .get('.alert > p')
  //     .should('contain', 'Internal Server Error')
  // })

  it('search people', () => {
    cy.visit('/orcid.org')
    cy.get('input[name="query"]')
      .type('hallett{enter}')
      .get('.alert > h4')
      .should('contain', 'An error occured.')
      .get('.alert > p')
      .should('contain', 'Internal Server Error')
  })

  // it('search organizations', () => {
  //   cy.visit('/ror.org')
  //   cy.get('input[name="query"]')
  //     .type('cambridge{enter}')
  //     .get('.alert > h4')
  //     .should('contain', 'An error occured.')
  //     .get('.alert > p')
  //     .should('contain', 'Internal Server Error')
  // })
})

export {}
