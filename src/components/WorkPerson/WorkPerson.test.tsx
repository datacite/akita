/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import WorkPerson from './WorkPerson'

describe('WorkMetadata Component', () => {
  let data

  beforeEach(function () {
    cy.fixture('doi.json').then((d) => {
      data = d
    })
  })

  it('creator', () => {
    mount(<WorkPerson person={data.creators[0]} />)
    cy.get('h4.work').contains('John Smith').should('be.visible')
    cy.get('div.affiliation').contains('DataCite').should('be.visible')
  })

  it('contributor', () => {
    mount(<WorkPerson person={data.contributors[0]} />)
    cy.get('h4.work').contains('John Smith').should('be.visible')
    cy.get('div.affiliation').contains('DataCite').should('be.visible')
    cy.get('div.contributor-type').contains('Editor').should('be.visible')
  })
})
