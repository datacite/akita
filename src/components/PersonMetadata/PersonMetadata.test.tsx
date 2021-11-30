import React from 'react'
import { mount } from '@cypress/react'
import PersonMetadata from './PersonMetadata'

describe('Person Metadata Component', () => {
  let data

  beforeEach(function () {
    cy.fixture('person.json').then((d) => {
      data = d
    })
  })

  it('orcid', () => {
    mount(<PersonMetadata metadata={data} />)
    cy.get('a#orcid-link')
      .contains('orcid.org/0000-0001-6528-2027')
      .should('be.visible')
  })

  // it('workCount', () => {
  //   mount(<PersonMetadata metadata={data} />)
  //   cy.get('i#work-count').contains('500').should('be.visible')
  // })

  // To be added after MVP according to feedback
  // it('citationCount', () => {
  //   mount(<PersonMetadata metadata={data}/>)
  //   cy.get('div.metrics-counter')
  //     .contains('33')
  //     .should('be.visible')
  // })

  it('name', () => {
    mount(<PersonMetadata metadata={data} />)
    cy.get('h3.work').contains('Juan Perez').should('be.visible')
  })

  // To be added after MVP according to feedback
  // it('viewCount', () => {
  //   mount(<PersonMetadata metadata={data}/>)
  //   cy.get('div#view-count')
  //     .should('not.be.visible')
  // })
})
