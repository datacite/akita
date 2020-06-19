/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import DoiMetadata from './DoiMetadata'

const exampleItem = {
  id: "https://handle.stage.datacite.org/10.21945/xs62-rp71",
  doi: "10.21945/xs62-rp71",
  url: "http://example.com",
  types: { resourceTypeGeneral: "Dataset", resourceType: "CSV file" },
  titles: [{ title: "Example title of the item" }],
  descriptions: [{ description: "Example description of the item." }],
  creators: [{ id: null, name: "Smith, John", givenName: "John", familyName: "Smith" }],
  publisher: "SURFsara",
  publicationYear: 2019,
  version: "1.0",
  citationCount: 4,
  viewCount: 8,
  downloadCount: 3
}

describe('DoiMetadata Component', () => {
  it('title', () => {
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('h3.work')
      .contains('Example title of the item Dataset')
      .should('be.visible')
  })
  
  it('creators', () => {
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.creators')
      .contains('John Smith')
      .should('be.visible')
  })

  it('metadata', () => {
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.metadata')
      .contains('Version 1.0 of CSV File published 2019 via SURFsara')
      .should('be.visible')
  })

  it('description', () => {
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.description')
      .contains('Example description of the item.')
      .should('be.visible')
  })

  it('metrics counter', () => {
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.metrics-counter')
      .contains('4 Citations 8 Views 3 Downloads')
      .should('be.visible')
  })

  it('actions', () => {
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.actions')
      .contains('Bookmark Claim')
      .should('be.visible')
  })
})
