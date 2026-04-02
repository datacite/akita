import React from 'react'
import { mount } from '@cypress/react'
import { MetricsDisplay } from './MetricsDisplay'

describe('MetricsDisplay Component', () => {
  it('adds accessible names to metric help links', () => {
    mount(
      <MetricsDisplay
        counts={{ citations: 33, views: 1200 }}
        links={{
          citations: 'https://support.datacite.org/docs/citations-and-references',
          views: 'https://support.datacite.org/docs/views-and-downloads'
        }}
      />
    )

    cy.get('a[aria-label="Learn more about citations metrics"]')
      .should('have.attr', 'href', 'https://support.datacite.org/docs/citations-and-references')
    cy.get('a[aria-label="Learn more about views metrics"]')
      .should('have.attr', 'href', 'https://support.datacite.org/docs/views-and-downloads')
  })
})
