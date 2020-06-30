/// <reference types="cypress" />

import React from 'react'
import {
  mount
} from 'cypress-react-unit-test'
import UsageChart from './UsageChart'

const data = {
  doi: "10.21945/xs62-rp71",
  publicationYear: 2017,
  viewCount: 137,
  viewsOverTime: [
    {
      yearMonth: "2018-12",
      total: 34,
    },
    {
      yearMonth: "2018-11",
      total: 3,
    },
    {
      yearMonth: "2018-10",
      total: 100,
    }
  ],
}

const oldData = {
  doi: "10.21945/xs62-rp71",
  publicationYear: 1985,
  type: "View",
  viewCount: 137,
  viewsOverTime: [
    {
      yearMonth: "1990-12",
      total: 34,
    },
    {
      yearMonth: "2018-11",
      total: 3,
    },
    {
      yearMonth: "2018-10",
      total: 100,
    }
  ],
}

describe('UsageChart Component', () => {
      it('normal data', () => {
          mount(
          <UsageChart doi={ data.doi } type="View" publicationYear={ data.publicationYear } counts={ data.viewCount} data={ data.viewsOverTime } />)
            cy.get('.mark-rect > path')
            .should('be.visible')
            .should('have.length', 3)

            cy.get('small')
            .should('be.visible')
            .contains('137 Views reported since publication in 2017')
          })

      // Data older than 10 years should not be showned
      it('old data', () => {
        mount(
        <UsageChart doi={ oldData.doi } type="View" publicationYear={ oldData.publicationYear } counts={ oldData.viewCount} data={ oldData.viewsOverTime } />)
          cy.get('.mark-rect > path')
          .should('be.visible')
          .should('have.length', 2)

          cy.get('small')
          .should('be.visible')
          .contains('137 Views reported since publication in 1985')
        })
      })