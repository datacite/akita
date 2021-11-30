import React from 'react'
import { mount } from '@cypress/react'
import Header from './Header'

describe('Header Component', () => {
  it('title', () => {
    mount(<Header path={'/doi.org'} />)
    cy.get('.navbar-brand').contains('DataCite Commons').should('be.visible')
  })

  it('about link', () => {
    mount(<Header path={'/doi.org'} />)
    cy.get('[data-cy=about]').contains('About').should('be.visible')
  })

  it('support link', () => {
    mount(<Header path={'/doi.org'} />)
    cy.get('[data-cy=support]').contains('Support').should('be.visible')
  })
})
