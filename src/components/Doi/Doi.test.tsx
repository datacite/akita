import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Doi from './Doi'

describe('Doi Component', () => {
  let data

  beforeEach(function () {
    cy.fixture('doi.json').then((d) => {
      data = d
    })
  })
  
  it('title', () => {
    mount(<Doi doi={data} />)
    cy.get('h3.work').contains('Example title of the item').should('be.visible')
  })

  it('creators', () => {
    mount(<Doi doi={data} />)
    cy.get('.creators').contains('John Smith').should('be.visible')
  })

  it('metadata', () => {
    mount(<Doi doi={data} />)
    cy.get('.metadata')
      .contains('Version 1.0 of CSV File published 2019 via SURFsara')
      .should('be.visible')
  })

  it('description', () => {
    mount(<Doi doi={data} />)
    cy.get('.description')
      .contains('Example description of the item.')
      .should('be.visible')
  })

  it('registered', () => {
    mount(<Doi doi={data} />)
    cy.get('.registered')
      .contains('DOI registered December 19, 2019')
      .should('be.visible')
  })

  it('metrics counter', () => {
    mount(<Doi doi={data} />)
    cy.get('.metrics-counter')
      .contains('4 Citations 8 Views 3K Downloads')
      .should('be.visible')
  })

  it('formatted citation', () => {
    mount(<Doi doi={data} />)
    cy.get('.formatted-citation')
      .contains(
        'Gallardo-Escárate, C., Valenzuela-Muñoz, V., Núñez-Acuña, G., & Haye, P. (2014). Data from: SNP discovery and gene annotation in the surf clam Mesodesma donacium (Version 1) [Data set]. Dryad. https://doi.org/10.5061/DRYAD.8JD18'
      )
      .should('be.visible')
  })

  it('analytics bar', () => {
    mount(<Doi doi={data} />)
    cy.get('.citations-over-time-tab').should('be.visible')
  })

  it('related works section', () => {
    mount(<Doi doi={data} />)
    cy.get('.citations-list').should('not.be.visible')
  })

  it('actions', () => {
    mount(<Doi doi={data} />)
    cy.get('.actions').contains('Bookmark Claim').should('be.visible')
  })
})
