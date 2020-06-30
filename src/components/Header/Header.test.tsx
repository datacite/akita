import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Header from "./Header"

describe('Header Component', () => {
  it('title', () => {
    mount(<Header title={'DataCite Commons'} />)
    cy.get('.navbar-brand')
      .contains('DataCite Commons')
      .should('be.visible')
  })

  it('about link', () => {
    mount(<Header title={'DataCite Commons'} />)
    cy.get('[data-cy=about]')
      .contains('About')
      .should('be.visible')
  })

  it('support link', () => {
    mount(<Header title={'DataCite Commons'} />)
    cy.get('[data-cy=support]')
      .contains('Support')
      .should('be.visible')
  })
})
