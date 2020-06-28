import React from 'react'
import { mount } from 'cypress-react-unit-test'
import Error from "./Error"

const errorTitle = "Error title"
const errorMessage = "An error has occured."

describe('Error Component', () => {
  it('title', () => {
    mount(<Error title={errorTitle} message={errorMessage} />)
    cy.get('.alert-danger h4')
      .contains('Error title')
      .should('be.visible')
  })

  it('message', () => {
    mount(<Error title={errorTitle} message={errorMessage} />)
    cy.get('.alert-danger p')
      .contains('An error has occured.')
      .should('be.visible')
  })
})
