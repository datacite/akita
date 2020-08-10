import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Person from './Person'

const data = {
  id: 'https://orcid.org/0000-0003-3484-6875',
  name: 'Juan Perez',
  givenName: 'Juan',
  familyName: 'Perez',
  citationCount: 33,
  viewCount: 0,
  downloadCount: 4504,
  affiliation: [],
  works: {
    pageInfo: {
      endCursor: 'MQ',
      hasNextPage: true
    },
    totalCount: 500,
    published: [
      {
        id: '2020',
        title: '2020',
        count: 20
      },
      {
        id: '2019',
        title: '2019',
        count: 37
      },
      {
        id: '2018',
        title: '2018',
        count: 31
      },
      {
        id: '2017',
        title: '2017',
        count: 21
      }
    ],
    resourceTypes: [
      {
        id: 'text',
        title: 'Text',
        count: 126
      },
      {
        id: 'audiovisual',
        title: 'Audiovisual',
        count: 16
      },
      {
        id: 'dataset',
        title: 'Dataset',
        count: 15
      },
      {
        id: 'software',
        title: 'Software',
        count: 11
      },
      {
        id: 'collection',
        title: 'Collection',
        count: 3
      },
      {
        id: 'image',
        title: 'Image',
        count: 2
      }
    ],
    nodes: [
      {
        id: 'https://handle.stage.datacite.org/10.21945/xs62-rp71',
        doi: '10.21945/xs62-rp71',
        url: 'http://example.com',
        types: { resourceTypeGeneral: 'Dataset', resourceType: 'CSV file' },
        titles: [{ title: 'Example title of the item' }],
        descriptions: [{ description: 'Example description of the item.' }],
        creators: [
          {
            id: null,
            name: 'Smith, John',
            givenName: 'John',
            familyName: 'Smith'
          }
        ],
        publisher: 'SURFsara',
        publicationYear: 2019,
        version: '1.0',
        formattedCitation:
          "Gallardo-Escárate, C., Valenzuela-Muñoz, V., Núñez-Acuña, G., &amp; Haye, P. (2014). <i>Data from: SNP discovery and gene annotation in the surf clam Mesodesma donacium</i> (Version 1) [Data set]. Dryad. <a href='https://doi.org/10.5061/DRYAD.8JD18'>https://doi.org/10.5061/DRYAD.8JD18</a>",
        citationCount: 4,
        registrationAgency: { id: 'datacite', name: 'DataCite' },
        viewCount: 8,
        rights: [],
        downloadCount: 3000,
        citationsOverTime: [],
        viewsOverTime: [],
        downloadsOverTime: [],
        citations: { nodes: [] },
        references: { nodes: [] }
      }
    ]
  }
}

describe('Person Component', () => {
  it('orcid', () => {
    mount(<Person person={data} />)
    cy.get('a#orcid-link')
      .contains('Juan Perez')
    cy.get('a#orcid-link')
      .should('have.attr', 'href')
      .and('eq', 'https://orcid.org/0000-0003-3484-6875')
  })

  it('link to doi page', () => {
    mount(<Person person={data} />)
    cy.get('h3.work > a')
      // the second element, the first is a#orcid-link
      .eq(1)
      .should('have.attr', 'href')
      .and('include', '/doi.org/')
  })

  it('work count', () => {
    mount(<Person person={data} />)
    cy.get('.production-chart').contains('500')
  })

  // it('citationCount', () => {
  //   mount(<Person person={data} />)
  //   cy.get('div#citation-count').contains('33').should('be.visible')
  // })

  // it('viewCount', () => {
  //   mount(<Person person={data} />)
  //   cy.get('div#view-count').should('not.be.visible')
  // })

  // it('downloadCount', () => {
  //   mount(<Person person={data}/>)
  //   cy.get('div#download-count')
  //     .contains('4.5k')
  //     .should('be.visible')
  // })

  it('analytics bar', () => {
    mount(<Person person={data} />)
    cy.get('.types-chart').should('be.visible')
    cy.get('.production-chart').should('be.visible')
  })

  it('related content section', () => {
    mount(<Person person={data} />)
    cy.get('.member-results').contains('Works')
    cy.get('.creators').contains('John Smith')
  })
})
