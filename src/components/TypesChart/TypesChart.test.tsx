/// <reference types="cypress" />

import React from 'react'
import {
  mount
} from 'cypress-react-unit-test'
import TypesChart from './TypesChart'

const data = {
  "id": "https://orcid.org/0000-0003-1419-2405",
  "name": "Martin Fenner",
  "givenName": "Martin",
  "familyName": "Fenner",
  "citationCount": 0,
  "viewCount": 0,
  "downloadCount": 0,
  "affiliation": [],
  "works": {
    "totalCount": 173,
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
  }
}



describe('TypesChart Component', () => {
  it('normal data', () => {
    mount(
    <TypesChart data={ data.works.resourceTypes } />)
      cy.get('.mark-arc > path')
      .should('be.visible')
      .should('have.length', 6)

      cy.get('.mark-symbol > path')
      .should('be.visible')
      .should('have.length', 6)

  })
})
      