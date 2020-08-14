/// <reference types="cypress" />

import React from 'react'
import { mount } from 'cypress-react-unit-test'
import LicenseChart from './LicenseChart'

describe('LicenseChart Component', () => {
  let data
  beforeEach(function () {
    cy.fixture('licenseChart.json').then((d) => {
      data = d
    })
  })

  it('normal data', () => {
    mount(
      <LicenseChart data={data.works.licenses} count={173} legend={true} />
    )
    cy.get('.mark-arc > path').should('be.visible').should('have.length', 2)

    cy.get('.mark-text > text').should('be.visible').contains('173')

    cy.get('.mark-symbol > path').should('be.visible').should('have.length', 2)
  })

  it('no legend', () => {
    mount(
      <LicenseChart data={data.works.licenses} count={1730} legend={false} />
    )
    cy.get('.mark-arc > path').should('be.visible').should('have.length', 2)

    cy.get('.mark-text > text').should('be.visible').contains('1.7K')

    cy.get('.mark-symbol > path')
      .should('not.be.visible')
      .should('have.length', 0)
  })
})
