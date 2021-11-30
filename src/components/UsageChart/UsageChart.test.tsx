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
    cy.get('.mark-rect > path').should('be.visible').should('have.length', 3)

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
    cy.get('.mark-rect > path').should('be.visible').should('have.length', 2)

    cy.get('.usage-chart').should('be.visible')

    cy.get('div')
      .should('be.visible')
      .contains('137 views reported since publication in 1985.')
  })
})
