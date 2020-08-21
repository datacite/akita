/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import WorkMetadata from './WorkMetadata'

describe('WorkMetadata Component', () => {
  let data

  beforeEach(function () {
    cy.fixture('doi.json').then((d) => {
      data = d
    })
  })

  it('title', () => {
    mount(<WorkMetadata metadata={data} />)
    cy.get('h3.work').contains('Example title of the item').should('be.visible')
  })

  it('creators', () => {
    mount(<WorkMetadata metadata={data} />)
    cy.get('.creators').contains('John Smith').should('be.visible')
  })

  it('no creators', () => {
    data.creators = []
    mount(<WorkMetadata metadata={data} />)
    cy.get('.creators').contains('No creators').should('be.visible')
  })

  it('metadata', () => {
    mount(<WorkMetadata metadata={data} />)
    cy.get('.metadata')
      .contains('Version 1.0 of CSV File published 2019 via SURFsara')
      .should('be.visible')
  })

  it('description', () => {
    mount(<WorkMetadata metadata={data} />)
    cy.get('.description')
      .contains('Example description of the item.')
      .should('be.visible')
  })

  it('tags', () => {
    mount(<WorkMetadata metadata={data} />)
    cy.get('.tags').contains('Dataset').should('be.visible')
  })

  it('metrics counter', () => {
    mount(<WorkMetadata metadata={data} />)
    cy.get('.metrics-counter')
      .contains('4 Citations 8 Views 3K Downloads')
      .should('be.visible')
  })

  it('metrics counter K', () => {
    data.citationCount = 4623
    data.viewCount = 8976
    data.downloadCount = 3143
    mount(<WorkMetadata metadata={data} />)
    cy.get('.metrics-counter')
      .contains('4.6K Citations 9K Views 3.1K Downloads')
      .should('be.visible')
  })

  it('metrics counter M', () => {
    data.citationCount = 4623000
    data.viewCount = 8976000
    data.downloadCount = 3143000
    mount(<WorkMetadata metadata={data} />)
    cy.get('.metrics-counter')
      .contains('4.6M Citations 9M Views 3.1M Downloads')
      .should('be.visible')
  })

  it('actions', () => {
    mount(<WorkMetadata metadata={data} />)
    cy.get('.actions')
    .should(($action) => {
      expect($action).to.have.length(3)
    })
  })
})
