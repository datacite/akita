describe("Search", () => {
  context('works', () => {
    it("search with enter", () => {
      cy.visit("/doi.org")
      cy.get('input[name="query"]')
        .type('climate{enter}')
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Works')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })

    it("search with submit", () => {
      cy.visit("/doi.org")
      cy.get('input[name="query"]')
        .type('climate')
        .get('.search-submit').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Works')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })

    it("search with click", () => {
      cy.visit("/doi.org")
      cy.get('input[name="query"]')
        .type('climate')
        .get('#works-link').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Works')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })

    it("search with query url", () => {
      cy.visit("/doi.org?query=climate")
      cy.get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })
  })

  context('work record', () => {
    it("search with enter", () => {
      cy.visit("/doi.org/10.17863/cam.10544")
      cy.get('input[name="query"]')
        .type('climate{enter}')
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Works')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })

    it("search with submit", () => {
      cy.visit("/doi.org/10.17863/cam.10544")
      cy.get('input[name="query"]')
        .type('climate')
        .get('.search-submit').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Works')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })

    it("search with click", () => {
      cy.visit("/doi.org/10.17863/cam.10544")
      cy.get('input[name="query"]')
        .type('climate')
        .get('#works-link').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Works')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Works')
    })
  })

  context('people', () => {
    it("search with enter", () => {
      cy.visit("/orcid.org")
      cy.get('input[name="query"]')
        .type('Josiah Carberry{enter}')
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'People')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })

    it("search with submit", () => {
      cy.visit("/orcid.org")
      cy.get('input[name="query"]')
        .type('Josiah Carberry')
        .get('.search-submit').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'People')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })

    it("search with click", () => {
      cy.visit("/orcid.org")
      cy.get('input[name="query"]')
        .type('Josiah Carberry')
        .get('#people-link').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'People')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })

    it("search with query url", () => {
      cy.visit("/orcid.org?query=josiah%20carberry")
      cy.get('#search-nav li.active', { timeout: 60000 })
      .should('contain', 'People')
      cy.get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })
  })
    
  context('person record', () => {
    it("search with enter", () => {
      cy.visit("/orcid.org/0000-0002-1825")
      cy.get('input[name="query"]')
        .type('Josiah Carberry{enter}')
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'People')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })

    it("search with submit", () => {
      cy.visit("/orcid.org/0000-0002-1825")
      cy.get('input[name="query"]')
        .type('Josiah Carberry')
        .get('.search-submit').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'People')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })

    it("search with click", () => {
      cy.visit("/orcid.org/0000-0002-1825")
      cy.get('input[name="query"]')
        .type('Josiah Carberry')
        .get('#people-link').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'People')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'People')
    })
  })

  context('organizations', () => {
    it("search with enter", () => {
      cy.visit("/ror.org")
      cy.get('input[name="query"]')
        .type('Cambridge{enter}')
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Organizations')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })

    it("search with submit", () => {
      cy.visit("/ror.org")
      cy.get('input[name="query"]')
        .type('Cambridge')
        .get('.search-submit').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Organizations')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })

    it("search with click", () => {
      cy.visit("/ror.org")
      cy.get('input[name="query"]')
        .type('Cambridge')
        .get('#organizations-link').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Organizations')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })

    it("search with query url", () => {
      cy.visit("/ror.org?query=cambridge")
      .get('#search-nav li.active', { timeout: 60000 })
      .should('contain', 'Organizations')
      cy.get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })
  })

  context('organization record', () => {
    it("search with enter", () => {
      cy.visit("/ror.org/013meh722")
      cy.get('input[name="query"]')
        .type('Cambridge{enter}')
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Organizations')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })

    it("search with submit", () => {
      cy.visit("/ror.org/013meh722")
      cy.get('input[name="query"]')
        .type('Cambridge')
        .get('.search-submit').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Organizations')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })

    it("search with click", () => {
      cy.visit("/ror.org/013meh722")
      cy.get('input[name="query"]')
        .type('Cambridge')
        .get('#organizations-link').click()
        .get('#search-nav li.active', { timeout: 60000 })
        .should('contain', 'Organizations')
        .get('.member-results', { timeout: 60000 })
        .should('contain', 'Organizations')
    })
  })
})

export {}
