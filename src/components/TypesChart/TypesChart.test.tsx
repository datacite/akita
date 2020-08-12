/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import TypesChart from './TypesChart'



describe('TypesChart Component', () => {
  let data
  beforeEach(function () {
    cy.fixture('typeChart.json').then((d) => {
      data = d
    })
  })

  it('normal data', () => {
    mount(
      <TypesChart data={data.works.resourceTypes} count={173} legend={true} />
    )
    cy.get('.mark-arc > path').should('be.visible').should('have.length', 6)

    cy.get('.mark-text > text').should('be.visible').contains('173')

    cy.get('.mark-symbol > path').should('be.visible').should('have.length', 6)
  })

  it('no legend', () => {
    mount(
      <TypesChart data={data.works.resourceTypes} count={1730} legend={false} />
    )
    cy.get('.mark-arc > path').should('be.visible').should('have.length', 6)

    cy.get('.mark-text > text').should('be.visible').contains('1.7K')

    cy.get('.mark-symbol > path')
      .should('not.be.visible')
      .should('have.length', 0)
  })
})
