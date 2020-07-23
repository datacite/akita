import React from 'react'
import { mount } from 'cypress-react-unit-test'
import PersonMetadata from './PersonMetadata'

const data = {
  id: "https://orcid.org/0000-0003-3484-6875",
  name: "Juan Perez",
  givenName: "Juan",
  familyName: "Perez",
  citationCount: 33,
  viewCount: 0,
  downloadCount: 4504,
  affiliation: [],
  works: {
    totalCount: 500,
    "published": [{
      "title": "2020",
      "count": 20
    },
    {
      "title": "2019",
      "count": 37
    },
    {
      "title": "2018",
      "count": 31
    },
    {
      "title": "2017",
      "count": 21
    }],
    "resourceTypes": [{
      "title": "Text",
      "count": 126
    },
    {
      "title": "Audiovisual",
      "count": 16
    },
    {
      "title": "Dataset",
      "count": 15
    },
    {
      "title": "Software",
      "count": 11
    },
    {
      "title": "Collection",
      "count": 3
    },
    {
      "title": "Image",
      "count": 2
    }
  ],
    nodes: [{
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
      registrationAgency: { id: 'datacite', name: 'DataCite' },
      viewCount: 8,
      downloadCount: 3000,
      citationsOverTime: [],
      viewsOverTime: [],
      rights: [],
      downloadsOverTime: [],
      citations: {nodes: [] },
      references: {nodes: [] }}
    ]
  },
}

describe('Person Component', () => {
  it('orcid', () => {
    mount(<PersonMetadata item={data}/>)
    cy.get('a#orcid-link')
      .contains('https://orcid.org/0000-0003-3484-6875')
      .should('be.visible')
  })
  
  it('workCount', () => {
    mount(<PersonMetadata item={data}/>)
    cy.get('i#work-count')
      .contains('500')
      .should('be.visible')
  })

  it('citationCount', () => {
    mount(<PersonMetadata item={data}/>)
    cy.get('div.metrics-counter')
      .contains('33')
      .should('be.visible')
  })

  it('name', () => {
    mount(<PersonMetadata item={data}/>)
    cy.get('h3.work')
      .contains('Juan Perez')
      .should('be.visible')
  })

  it('viewCount', () => {
    mount(<PersonMetadata item={data}/>)
    cy.get('div#view-count')
      .should('not.be.visible')
  })

})
