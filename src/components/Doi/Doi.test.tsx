import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Doi from './Doi'

const data = {
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
  formattedCitation: "Gallardo-Escárate, C., Valenzuela-Muñoz, V., Núñez-Acuña, G., &amp; Haye, P. (2014). <i>Data from: SNP discovery and gene annotation in the surf clam Mesodesma donacium</i> (Version 1) [Data set]. Dryad. <a href='https://doi.org/10.5061/DRYAD.8JD18'>https://doi.org/10.5061/DRYAD.8JD18</a>",
  citationCount: 4,
  viewCount: 8,
  downloadCount: 3000,
  citationsOverTime: [],
  citations: {nodes: [] },
  references: {nodes: [] },
}

describe('ContentItem Component', () => {
  it('title', () => {
    mount(<Doi item={data}/>)
    cy.get('h3.work')
      .contains('Example title of the item Dataset')
      .should('be.visible')
  })
  
  it('creators', () => {
    mount(<Doi item={data}/>)
    cy.get('.creators')
      .contains('John Smith')
      .should('be.visible')
  })

  it('metadata', () => {
    mount(<Doi item={data}/>)
    cy.get('.metadata')
      .contains('Version 1.0 of CSV File published 2019 via SURFsara')
      .should('be.visible')
  })

  it('description', () => {
    mount(<Doi item={data}/>)
    cy.get('.description')
      .contains('Example description of the item.')
      .should('be.visible')
  })

  it('metrics counter', () => {
    mount(<Doi item={data}/>)
    cy.get('.metrics-counter')
      .contains('4 Citations 8 Views 3K Downloads')
      .should('be.visible')
  })

  it('formatted citation', () => {
    mount(<Doi item={data}/>)
    cy.get('.formatted-citation')
      .contains('Gallardo-Escárate, C., Valenzuela-Muñoz, V., Núñez-Acuña, G., & Haye, P. (2014). Data from: SNP discovery and gene annotation in the surf clam Mesodesma donacium (Version 1) [Data set]. Dryad. https://doi.org/10.5061/DRYAD.8JD18')
      .should('be.visible')
  })

  it('analytics bar', () => {
    mount(<Doi item={data}/>)
    cy.get('.citations-over-time-tab')
      .should('be.visible')
  })

  it('related content section', () => {
    mount(<Doi item={data}/>)
    cy.get('.citations-list')
      .should('not.be.visible')
  })

  it('actions', () => {
    mount(<Doi item={data}/>)
    cy.get('.actions')
      .contains('Bookmark Claim')
      .should('be.visible')
  })
})
