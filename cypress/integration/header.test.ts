describe("Header", () => {
  context('works', () => {
    it("search", () => {
      cy.visit("/")
      cy.get('input[name="query"]')
        .type('climate{enter}')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })

    it("search with click", () => {
      cy.visit("/")
      cy.get('input[name="query"]')
        .type('climate')
        .get('#works-link').click()
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })

    it("search with query url", () => {
      cy.visit("/?query=climate")
      cy.get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })
  })

  context('work record', () => {
    it("search", () => {
      cy.visit("/doi.org/10.17863/cam.10544")
      cy.get('input[name="query"]')
        .type('climate{enter}')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })

    it("search with click", () => {
      cy.visit("/doi.org/10.17863/cam.10544")
      cy.get('input[name="query"]')
        .type('climate')
        .get('#works-link').click()
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })
  })

  context('people', () => {
    it("search", () => {
      cy.visit("/orcid.org")
      cy.get('input[name="query"]')
        .type('Josiah Carberry{enter}')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })

    it("search with click", () => {
      cy.visit("/orcid.org")
      cy.get('input[name="query"]')
        .type('Josiah Carberry')
        .get('#people-link').click()
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })

    it("search with query url", () => {
      cy.visit("/orcid.org?query=josiah%20carberry")
      cy.get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })
  })
    
  context('person record', () => {
    it("search", () => {
      cy.visit("/orcid.org/0000-0002-1825")
      cy.get('input[name="query"]')
        .type('Josiah Carberry{enter}')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })

    it("search with click", () => {
      cy.visit("/orcid.org/0000-0002-1825")
      cy.get('input[name="query"]')
        .type('Josiah Carberry')
        .get('#people-link').click()
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })
  })

  context('organizations', () => {
    it("search", () => {
      cy.visit("/ror.org")
      cy.get('input[name="query"]')
        .type('Cambridge{enter}')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })

    it("search with click", () => {
      cy.visit("/ror.org")
      cy.get('input[name="query"]')
        .type('Cambridge')
        .get('#organizations-link').click()
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })

    it("search with query url", () => {
      cy.visit("/ror.org?query=cambridge")
      cy.get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })
  })

  context('organization record', () => {
    it("search", () => {
      cy.visit("/ror.org/013meh722")
      cy.get('input[name="query"]')
        .type('Cambridge{enter}')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })

    it("search with click", () => {
      cy.visit("/ror.org/013meh722")
      cy.get('input[name="query"]')
        .type('Cambridge')
        .get('#organizations-link').click()
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })
  })
})
