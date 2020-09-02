import React from 'react'
import { mount } from 'cypress-react-unit-test'
import PersonEmployment from './PersonEmployment'

describe('PersonEmployment Component', () => {
  let data

  beforeEach(function () {
    cy.fixture('person.json').then((d) => {
      data = d.employment
    })
  })

  it('employment', () => {
    mount(<PersonEmployment employment={data} />)
    cy.get('h3.work').contains('DataCite')
  })
})
