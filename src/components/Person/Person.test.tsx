import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Person from './Person'

describe('Person Component', () => {
  let data

  beforeEach(function () {
    cy.fixture('person.json').then((d) => {
      data = d
    })
  })

  it('orcid', () => {
    mount(<Person person={data} />)
    cy.get('a#orcid-link')
      .contains('Juan Perez')
    cy.get('a#orcid-link')
      .should('have.attr', 'href')
      .and('contains', 'orcid.org/0000-0003-3484-6875')
  })

  it('link to doi page', () => {
    mount(<Person person={data} />)
    cy.get('h3.work > a')
      // the second element, the first is a#orcid-link
      .eq(1)
      .should('have.attr', 'href')
      .and('include', '/doi.org/')
  })

  it('work count', () => {
    mount(<Person person={data} />)
    cy.get('.production-chart').contains('500')
  })

  // it('citationCount', () => {
  //   mount(<Person person={data} />)
  //   cy.get('div#citation-count').contains('33').should('be.visible')
  // })

  // it('viewCount', () => {
  //   mount(<Person person={data} />)
  //   cy.get('div#view-count').should('not.be.visible')
  // })

  // it('downloadCount', () => {
  //   mount(<Person person={data}/>)
  //   cy.get('div#download-count')
  //     .contains('4.5k')
  //     .should('be.visible')
  // })

  it('analytics bar', () => {
    mount(<Person person={data} />)
    cy.get('.types-chart').should('be.visible')
    cy.get('.production-chart').should('be.visible')
  })

  it('related content section', () => {
    mount(<Person person={data} />)
    cy.get('.member-results').contains('Works')
    cy.get('.creators').contains('John Smith')
  })
})
