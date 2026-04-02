import React from 'react'
import { mount } from '@cypress/react'
import Header from './Header'

describe('Header Component', () => {
  it('provides an accessible name for the home logo link', () => {
    mount(<Header />)

    cy.get('a[aria-label="DataCite Commons home"]')
      .should('have.attr', 'href', '/')
  })
})
