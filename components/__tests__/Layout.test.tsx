/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Layout from "../Layout";

describe('Layout Component', () => {
  it('title', () => {
    mount(<Layout title={'DataCite Commons'}/>)
    cy.get('.navbar-brand')
      .contains('DataCite Commons')
      .should('be.visible')
  })

  it('children', () => {
    mount(<Layout children={'Bla bla'}/>)
    cy.get('.container-fluid')
      .contains('Bla bla')
      .should('be.visible')
  })
})
