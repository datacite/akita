describe('Search', () => {
  describe('Works', () => {
    beforeEach(() => {
      cy.setCookie('_consent', 'true')
    })

    context('works', () => {
      it('search with enter', () => {
        cy.visit('/doi.org')
        cy.get('input[name="query"]')
          .type('climate{enter}')
          .get('#search-nav li.active', { timeout: 60000 })
          .should('contain', 'Works')
          .get('.member-results', { timeout: 60000 })
          .should('contain', 'Works')
      })

      it('search with submit', () => {
        cy.visit('/doi.org')
        cy.get('input[name="query"]')
          .type('climate')
          .get('.search-submit')
          .click()
          .get('#search-nav li.active', { timeout: 60000 })
          .should('contain', 'Works')
          .get('.member-results', { timeout: 60000 })
          .should('contain', 'Works')
      })

      // it('search with click', () => {
      //   cy.visit('/doi.org')
      //   cy.get('input[name="query"]')
      //     .type('climate')
      //     .get('#works-link')
      //     .click()
      //     .get('#search-nav li.active', { timeout: 60000 })
      //     .should('contain', 'Works')
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Works')
      // })

      // it('search with query url', () => {
      //   cy.visit('/doi.org?query=climate')
      //   cy.get('.member-results', { timeout: 60000 }).should('contain', 'Works')
      // })
    })
  })

  describe('Work Record', () => {
    beforeEach(() => {
      cy.setCookie('_consent', 'true')
    })

    context('work record', () => {
      // it('search with enter', () => {
      //   cy.visit('/doi.org/10.17863/cam.10544')
      //   cy.get('input[name="query"]')
      //     .type('climate{enter}')
      //     .get('#search-nav li.active', { timeout: 60000 })
      //     .should('contain', 'This Page')
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Works')
      // })

      // it("search with submit", () => {
      //   cy.visit("/doi.org/10.17863/cam.10544")
      //   cy.get('input[name="query"]')
      //     .type('climate')
      //     .get('.search-submit').click()
      //     .get('#search-nav li.active', { timeout: 60000 })
      //     .should('contain', 'This Page')
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Works')
      // })

      it('search with click', () => {
        cy.visit('/doi.org/10.17863/cam.10544')
        cy.get('#works-link')
          .click()
          .get('input[name="query"]')
          .type('climate')
          .get('#search-nav li.active', { timeout: 60000 })
          .should('contain', 'Works')
          .get('.member-results', { timeout: 60000 })
          .should('contain', 'Works')
      })
    })
  })

  describe('People', () => {
    beforeEach(() => {
      cy.setCookie('_consent', 'true')
    })

    context('people', () => {
      it('search with enter', () => {
        cy.visit('/orcid.org')
        cy.get('input[name="query"]')
          .type('Josiah Carberry{enter}')
          .get('#search-nav li.active', { timeout: 60000 })
          .should('contain', 'People')
          .get('.member-results', { timeout: 60000 })
          .should('contain', 'People')
      })

      it('search with submit', () => {
        cy.visit('/orcid.org')
        cy.get('input[name="query"]')
          .type('Josiah Carberry')
          .get('.search-submit')
          .click()
          .get('#search-nav li.active', { timeout: 60000 })
          .should('contain', 'People')
          .get('.member-results', { timeout: 60000 })
          .should('contain', 'People')
      })

      it('search with click', () => {
        cy.visit('/orcid.org')
        cy.get('input[name="query"]')
          .type('Josiah Carberry')
          .get('#people-link')
          .click()
          .get('#search-nav li.active', { timeout: 60000 })
          .should('contain', 'People')
          .get('.member-results', { timeout: 60000 })
          .should('contain', 'People')
      })

      it('search with query url', () => {
        cy.visit('/orcid.org?query=josiah%20carberry')
        cy.get('#search-nav li.active', { timeout: 60000 }).should(
          'contain',
          'People'
        )
        cy.get('.member-results', { timeout: 60000 }).should(
          'contain',
          'People'
        )
      })
    })
  })

  describe('People Record', () => {
    beforeEach(() => {
      cy.setCookie('_consent', 'true')
    })

    context('person record', () => {
      it('search with enter', () => {
        cy.visit('/orcid.org/0000-0001-6528-2027')
        cy.get('input[name="query-facets"]')
          .type('datacite{enter}')
          .get('.member-results', { timeout: 60000 })
          .should('contain', 'Work')
      })

      // it('search with submit', () => {
      //   cy.visit('/orcid.org/0000-0001-6528-2027')
      //   cy.get('input[name="query-facets"]')
      //     .type('datacite')
      //     .get('.search-submit-facets')
      //     .click()
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Work')
      // })

      // it('search with click', () => {
      //   cy.visit('/orcid.org/0000-0001-6528-2027')
      //   cy.get('input[name="query-facets"]')
      //     .type('Richard Hallett')
      //     .get('.search-submit-facets')
      //     .click()
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', '1 Work')
      // })
    })
  })

  describe('Organizations', () => {
    beforeEach(() => {
      cy.setCookie('_consent', 'true')
    })

    context('organizations', () => {
      // it('search with enter', () => {
      //   cy.visit('/ror.org')
      //   cy.get('input[name="query-facets"]')
      //     .type('Cambridge{enter}')
      //     .get('#search-nav li.active', { timeout: 60000 })
      //     .should('contain', 'Organizations')
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Organizations')
      // })

      // it('search with submit', () => {
      //   cy.visit('/ror.org')
      //   cy.get('input[name="query-facets"]')
      //     .type('Cambridge')
      //     .get('.search-submit')
      //     .click()
      //     .get('#search-nav li.active', { timeout: 60000 })
      //     .should('contain', 'Organizations')
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Organizations')
      // })

      // it('search with click', () => {
      //   cy.visit('/ror.org')
      //   cy.get('input[name="query-facets"]')
      //     .type('Cambridge')
      //     .get('.search-submit-facets')
      //     .click()
      //     .get('#search-nav li.active', { timeout: 60000 })
      //     .should('contain', 'Organizations')
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Organizations')
      // })

      it('search with query url', () => {
        cy.visit('/ror.org?query=cambridge')
          .get('#search-nav li.active', { timeout: 60000 })
          .should('contain', 'Organizations')
        cy.get('.member-results', { timeout: 60000 }).should(
          'contain',
          'Organizations'
        )
      })
    })
  })

  describe('Organization Record', () => {
    beforeEach(() => {
      cy.setCookie('_consent', 'true')
    })

    context('organization record', () => {
      // it('search with enter', () => {
      //   cy.visit('/ror.org/013meh722')
      //   cy.get('input[name="query"]')
      //     .type('Springer{enter}')
      //     .get('#search-nav li.active', { timeout: 60000 })
      //     .should('contain', 'Page')
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Works')
      // })

      // it('search with submit', () => {
      //   cy.visit('/ror.org/013meh722')
      //   cy.get('input[name="query"]')
      //     .type('Springer')
      //     .get('.search-submit')
      //     .click()
      //     .get('#search-nav li.active', { timeout: 60000 })
      //     .should('contain', 'Page')
      //     .get('.member-results', { timeout: 60000 })
      //     .should('contain', 'Works')
      // })

      it('search with click', () => {
        cy.visit('/ror.org/013meh722')
        cy.get('input[name="query"]')
          .type('Cambridge')
          .get('#organizations-link')
          .click()
          .get('#search-nav li.active', { timeout: 60000 })
          .should('contain', 'Organizations')
          .get('.member-results', { timeout: 60000 })
          .should('contain', 'Organizations')
      })
    })
  })
})

export {}
