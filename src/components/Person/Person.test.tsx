import React from 'react'
import { mount } from '@cypress/react'
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
    cy.get('a#orcid-link').contains('Martin Fenner')
    cy.get('a#orcid-link')
      .should('have.attr', 'href')
      .and('contains', 'orcid.org/0000-0001-6528-2027')
  })

  // it('actions', () => {
  //   mount(<Person person={data} />)
  //   cy.get('.actions')
  //   .should(($action) => {
  //     expect($action).to.have.length(3)
  //   })
  // })

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
})
