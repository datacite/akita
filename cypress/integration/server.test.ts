describe("Search", () => {  
  it('search with error', () => {
    cy.server()
    cy.route({
      url: 'https://api.stage.datacite.org/graphql',
      method: 'POST',
      status: 500,
      response: {
        "errors": [
          {
            "message": "Internal Server Error"
          }
        ]
      }
    })

    cy.visit('/')

    cy.get('input[name="query"]')
      .type('hallett')
      .get('.alert > h4')
      .should('contain', 'An error occured.')
      .get('.alert > p')
      .should('contain', 'Network error: Response not successful: Received status code 500')
  })
})
