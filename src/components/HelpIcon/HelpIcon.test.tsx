import React from 'react'
import { mount } from '@cypress/react'
import HelpIcon from './HelpIcon'

describe('HelpIcon Component', () => {
  it('falls back to text-based link labels when linkLabel is blank', () => {
    mount(
      <HelpIcon
        link="https://example.com/help"
        text="Citation details"
        linkLabel="   "
        position='inline'
      />
    )

    cy.get('a[aria-label="Open help: Citation details"]')
      .should('have.attr', 'href', 'https://example.com/help')
  })
})
