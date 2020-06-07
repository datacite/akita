/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Footer from "../Footer"

describe('Footer Component', () => {
  it('works', () => {
    mount(<Footer />)
    cy.get('[data-cy=about]')
      .contains('About DataCite')
      .should('be.visible')
  })
})
