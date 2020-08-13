/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import ProductionChart from './ProductionChart'

const data = {
  works: {
    totalCount: 177,
    resourceTypes: [
      {
        title: 'Text',
        count: 126
      },
      {
        title: 'Audiovisual',
        count: 16
      },
      {
        title: 'Dataset',
        count: 15
      },
      {
        title: 'Software',
        count: 11
      },
      {
        title: 'Collection',
        count: 3
      },
      {
        title: 'Image',
        count: 2
      }
    ],
    published: [
      {
        title: '2020',
        count: 20
      },
      {
        title: '2019',
        count: 37
      },
      {
        title: '2018',
        count: 31
      },
      {
        title: '2017',
        count: 21
      },
      {
        title: '2016',
        count: 24
      },
      {
        title: '2015',
        count: 27
      },
      {
        title: '2014',
        count: 2
      },
      {
        title: '2013',
        count: 7
      },
      {
        title: '2012',
        count: 4
      },
      {
        title: '1990',
        count: 4
      }
    ]
  }
}

describe('ProductionChart Component', () => {
  it('normal data', () => {
    mount(
      <ProductionChart
        doiCount={data.works.totalCount}
        data={data.works.published}
      />
    )
    cy.get('.mark-rect > path').should('be.visible').should('have.length', 9)
    cy.get('.production-chart .title').should('be.visible').contains('works by Year of Publication')
  })
})
