// /// <reference types="cypress" />

// describe('User Menu', () => {
//   beforeEach(() => {
//     cy.setCookie('_consent', 'true')
//     cy.setCookie('_datacite', Cypress.env('userCookie'), { log: false })
//   })

// it('menu item', () => {
//   cy.visit('/')
//   cy.get('#sign-in', { timeout: 30000 }).contains('Martin Fenner')
// })

// it('beta tester', () => {
//   cy.visit('/')
//   cy.get('#sign-in', { timeout: 30000 }).click()
//   cy.get('[data-cy=beta]').contains('Beta Tester')
// })

// it('settings', () => {
//   cy.visit('/')
//   cy.get('#sign-in', { timeout: 30000 })
//     .click()
//     .get('[data-cy=settings]')
//     .contains('Settings')
// })

// it('commons page', () => {
//   cy.visit('/')
//   cy.get('#sign-in', { timeout: 30000 })
//     .click()
//     .get('[data-cy=commons-page]')
//     .contains('Commons Page')
// })

// it('orcid', () => {
//   cy.visit('/')
//   cy.get('#sign-in', { timeout: 30000 })
//     .click()
//     .get('[data-cy=orcid]')
//     .contains('ORCID Record')
// })

// it('sign out', () => {
//   cy.visit('/')
//   cy.get('#sign-in', { timeout: 30000 })
//     .click()
//     .get('[data-cy=signout]')
//     .contains('Sign Out')
// })
// })

// export {}
