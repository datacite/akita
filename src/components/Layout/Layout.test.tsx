import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Layout from './Layout'

describe('Layout Component', () => {
  it('title', () => {
    mount(<Layout title={'DataCite Commons'} path={'/'} />)
    cy.get('.navbar-brand').contains('DataCite Commons').should('be.visible')
  })

  it('children', () => {
    const children = 'Bla bla'
    mount(<Layout title={'DataCite Commons'} path={'/'} >{children}</Layout>)
    cy.get('.container-fluid').contains('Bla bla').should('be.visible')
  })
})
