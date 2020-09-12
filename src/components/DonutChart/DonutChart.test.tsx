/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import DonutChart, { typesRange, typesDomain } from './DonutChart'

describe('DonutChart Component', () => {
  let data
  beforeEach(function () {
    cy.fixture('donutChart.json').then((d) => {
      data = d
    })
  })

  it('normal data', () => {
    mount(
      <DonutChart
        data={data.works.resourceTypes}
        count={173}
        legend={true}
        title="Work Type"
        range={typesRange}
        domain={typesDomain}
      />
    )
    cy.get('.mark-arc > path').should('be.visible')

    cy.get('.mark-text > text').should('be.visible').contains('173')

    cy.get('.mark-symbol > path').should('be.visible')
  })

  it('no legend', () => {
    mount(
      <DonutChart
        data={data.works.resourceTypes}
        count={1730}
        legend={false}
        title="Work Type"
        range={typesRange}
        domain={typesDomain}
      />
    )
    cy.get('.mark-arc > path').should('be.visible').should('have.length', 6)

    cy.get('.mark-text > text').should('be.visible').contains('1.7K')

    cy.get('.mark-symbol > path')
      .should('not.be.visible')
      .should('have.length', 0)
  })
})
