/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import ContentItem from './ContentItem'

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
  rights: [{
    rights: 'Creative Commons Attribution 3.0 Unported',
    rightsUri: 'http://creativecommons.org/licenses/by/3.0/de/deed.en',
    rightsIdentifier: ' CC-BY-3.0',
    rightsIdentifierScheme: 'SPDX',
    schemeUri: 'https://spdx.org/licenses/',
  }],
  citationCount: 4,
  citationsOverTime: [{ total: 4, year: 2020 }],
  viewCount: 8,
  downloadCount: 3,
}

describe('ContentItem Component', () => {
  it('title', () => {
    mount(<ContentItem item={exampleItem}/>)
    cy.get('h3.work')
      .contains('Example title of the item Dataset')
      .should('be.visible')
  })
  
  it('creators', () => {
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.creators')
      .contains('John Smith')
      .should('be.visible')
  })

  it('metadata', () => {
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.metadata')
      .contains('Version 1.0 of CSV File published 2019 via SURFsara')
      .should('be.visible')
  })

  it('description', () => {
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.description')
      .contains('Example description of the item.')
      .should('be.visible')
  })

  it('metrics counter', () => {
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.metrics-counter')
      .contains('4 Citations 8 Views 3 Downloads')
      .should('be.visible')
  })

  it('metrics counter K', () => {
    exampleItem.citationCount = 4623
    exampleItem.viewCount = 8976
    exampleItem.downloadCount = 3143
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.metrics-counter')
      .contains('4.6K Citations 9K Views 3.1K Downloads')
      .should('be.visible')
  })

  it('metrics counter M', () => {
    exampleItem.citationCount = 4623000
    exampleItem.viewCount = 8976000
    exampleItem.downloadCount = 3143000
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.metrics-counter')
      .contains('4.6M Citations 9M Views 3.1M Downloads')
      .should('be.visible')
  })

  it('metrics counter B', () => {
    exampleItem.citationCount = 4623000000
    exampleItem.viewCount = 8976000000
    exampleItem.downloadCount = 3143000000
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.metrics-counter')
      .contains('4.6B Citations 9B Views 3.1B Downloads')
      .should('be.visible')
  })

  it('metrics counter T', () => {
    exampleItem.citationCount = 4623000000000
    exampleItem.viewCount = 8976000000000
    exampleItem.downloadCount = 3143000000000
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.metrics-counter')
      .contains('4.6T Citations 9T Views 3.1T Downloads')
      .should('be.visible')
  })

  it('actions', () => {
    mount(<ContentItem item={exampleItem}/>)
    cy.get('.actions')
      .contains('Bookmark Claim')
      .should('be.visible')
  })
})
