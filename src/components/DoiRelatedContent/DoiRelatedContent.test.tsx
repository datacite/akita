import React from 'react'
import { mount } from 'cypress-react-unit-test'
import DoiRelatedContent from './DoiRelatedContent'

describe('DoiRelatedContent Component', () => {
  let data

  beforeEach(function () {
    cy.fixture('doi.json').then((d) => {
      data = d
    })
  })

  it('the list is displayed', () => {
    mount(
      <DoiRelatedContent dois={data.references} />
    )
    cy.get('.panel-transparent').should('be.visible')
  })

  it('the list correct the right number of items', () => {
    mount(
      <DoiRelatedContent dois={data.references} />
    )
    cy.get('.panel-transparent')
      .should('be.visible')
      .should('have.length', 2)
  })
})
