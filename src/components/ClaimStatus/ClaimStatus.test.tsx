/// <reference types="cypress" />

import React from 'react'
import { mount } from '@cypress/react'
import ClaimStatus from './ClaimStatus'

const deleted = {
  id: '10.21945/xs62-rp71',
  state: "deleted",
  sourceId: "",
  claimAction:"",
  claimed: null,
  errorMessages: null
}

const claimed = {
  id: '10.21945/xs62-rp71',
  state: "claimed",
  sourceId: "",
  claimAction:"",
  claimed: null,
  errorMessages: null
}

describe('ClaimStatus Component', () => {

  it('deleted', () => {
    mount(
      <ClaimStatus
        claim={deleted}
      />
    )
    cy.get('.label .label-info').should('be.not.visible')
  })

  it('claimed', () => {
    mount(
      <ClaimStatus
        claim={claimed}
      />
    )
    cy.get('.label .label-success').should('be.visible')

  })
})
