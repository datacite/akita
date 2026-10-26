/// <reference types="cypress" />

import React from 'react'
import { mount } from '@cypress/react'
import UsageChart from './UsageChart'

const oldData = {
  doi: '10.21945/xs62-rp71',
  publicationYear: 1985,
  type: 'View',
  viewCount: 137,
  viewsOverTime: [
    {
      yearMonth: '1990-12',
      total: 34
    },
    {
      yearMonth: '2018-11',
      total: 3
    },
    {
      yearMonth: '2018-10',
      total: 100
    }
  ]
}

describe('UsageChart Component', () => {
  let data
  
  beforeEach(function () {
    // The chart shows at most the last three years, so pin the date to one
    // where the 2018 fixture months are inside that window. Only Date is
    // faked; Recharts' timers keep running.
    cy.clock(new Date('2019-06-15T12:00:00Z'), ['Date'])
    cy.fixture('usageChart.json').then((d) => {
      data = d
    })
  })

  it('normal data', () => {
    mount(
      <UsageChart
        doi={data.doi}
        type="view"
        publicationYear={data.publicationYear}
        counts={data.viewCount}
        data={data.viewsOverTime}
      />
    )
    cy.get('.recharts-bar-rectangle path').should('be.visible').should('have.length', 3)

    cy.get('.usage-chart').should('be.visible')

    cy.get('div')
      .should('be.visible')
      .contains('137 views reported since publication in 2017.')
  })

  // Data older than 10 years should not be shown
  it('old data', () => {
    mount(
      <UsageChart
        doi={oldData.doi}
        type="view"
        publicationYear={oldData.publicationYear}
        counts={oldData.viewCount}
        data={oldData.viewsOverTime}
      />
    )
    cy.get('.recharts-bar-rectangle path').should('be.visible').should('have.length', 2)

    cy.get('.usage-chart').should('be.visible')

    cy.get('div')
      .should('be.visible')
      .contains('137 views reported since publication in 1985.')
  })
})
