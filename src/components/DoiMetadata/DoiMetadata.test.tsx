/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import DoiMetadata from './DoiMetadata'

let exampleItem = {
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
  rights: [{
    rights: 'Creative Commons Attribution 3.0 Unported',
    rightsUri: 'http://creativecommons.org/licenses/by/3.0/de/deed.en',
    rightsIdentifier: ' CC-BY-3.0',
    rightsIdentifierScheme: 'SPDX',
    schemeUri: 'https://spdx.org/licenses/',
  }],
  registrationAgency: { id: 'datacite', name: 'DataCite' },
  language: { id: 'fr', name: 'French' },
  citationCount: 4,
  citationsOverTime: [{ total: 4, year: 2020 }],
  viewCount: 8,
  downloadCount: 3,
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

  it('no creators', () => {
    exampleItem.creators = []
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.creators')
      .contains('No creators')
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

  it('metrics counter K', () => {
    exampleItem.citationCount = 4623
    exampleItem.viewCount = 8976
    exampleItem.downloadCount = 3143
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.metrics-counter')
      .contains('4.6K Citations 9K Views 3.1K Downloads')
      .should('be.visible')
  })

  it('metrics counter M', () => {
    exampleItem.citationCount = 4623000
    exampleItem.viewCount = 8976000
    exampleItem.downloadCount = 3143000
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.metrics-counter')
      .contains('4.6M Citations 9M Views 3.1M Downloads')
      .should('be.visible')
  })

  it('actions', () => {
    mount(<DoiMetadata item={exampleItem}/>)
    cy.get('.actions')
      .contains('Bookmark Claim')
      .should('be.visible')
  })
})
