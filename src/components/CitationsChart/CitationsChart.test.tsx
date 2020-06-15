/// <reference types="cypress" />

import React from 'react'
import {
  mount
} from 'cypress-react-unit-test'
import CitationsChart from './CitationsChart'

const data = {
  doi: "10.21945/xs62-rp71",
  publicationYear: 2014,
  citationCount: 137,
  citationOverTime: [
    {
      year: 2018,
      total: 34,
    },
    {
      year: 2016,
      total: 3,
    },
    {
      year: 2019,
      total: 100,
    }
  ],
}

const oldData = {
  doi: "10.21945/xs62-rp71",
  publicationYear: 1985,
  citationCount: 137,
  citationOverTime: [{
      year: 1990,
      total: 34,
    },
    {
      year: 1991,
      total: 3,
    },
    {
      year: 2000,
      total: 100,
    }
  ],
}

describe('CitationsChart Component', () => {
      it('normal data', () => {
          mount(
          <CitationsChart doi={ data.doi } publicationYear={ data.publicationYear } citationCount={ data.citationCount} data={ data.citationOverTime } />)
            cy.get('.mark-rect > path')
            .should('be.visible')
            .should('have.length', 3)

            cy.get('small')
            .should('be.visible')
            .contains('137 Citations reported since publication in 2014')
          })

      // Data older than 10 years should not be showned
      it('old data', () => {
        mount(
        <CitationsChart doi={ oldData.doi } publicationYear={ oldData.publicationYear } citationCount={ oldData.citationCount} data={ oldData.citationOverTime } />)
          cy.get('.mark-rect > path')
          .should('not.be.visible')
          .should('have.length', 0)

          cy.get('small')
          .should('be.visible')
          .contains('137 Citations reported since publication in 1985')
        })
      })