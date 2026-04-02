import React from 'react'
import { mount } from '@cypress/react'
import Footer from './Footer'

describe('Footer Component', () => {
  it('adds accessible names to social links', () => {
    mount(<Footer />)

    cy.get('a[aria-label="Email DataCite support"]').should('exist')
    cy.get('a[aria-label="Visit the DataCite blog"]').should('exist')
    cy.get('a[aria-label="Visit DataCite on GitHub"]').should('exist')
    cy.get('a[aria-label="Visit DataCite on X"]').should('exist')
    cy.get('a[aria-label="Visit DataCite on Mastodon"]').should('exist')
    cy.get('a[aria-label="Visit DataCite on LinkedIn"]').should('exist')
    cy.get('a[aria-label="Visit the DataCite YouTube channel"]').should('exist')
  })
})
