import React from 'react'
import { mount } from '@cypress/react'
import { License } from './License'

describe('License Component', () => {
  it('adds accessible names to icon-only license links', () => {
    mount(
      <License
        rights={[
          {
            rights: 'Creative Commons Attribution 4.0 International',
            rightsUri: 'https://creativecommons.org/licenses/by/4.0/',
            rightsIdentifier: 'cc-by-4.0'
          },
          {
            rights: 'Traditional Knowledge Notice',
            rightsUri: 'https://localcontexts.org/notice/tk-notice/',
            rightsIdentifier: 'tk-notice',
            rightsIdentifierScheme: 'Local Contexts'
          }
        ]}
      />
    )

    cy.get('a[aria-label="View license details: Creative Commons"]')
      .should('exist')

    cy.get('a[aria-label="View license details: Creative Commons Attribution"]')
      .should('exist')

    cy.get('a[aria-label="View license details: Traditional Knowledge Notice"]')
      .should('exist')
  })

  it('renders navigable links for other rights badges', () => {
    mount(
      <License
        rights={[
          {
            rights: 'MIT License',
            rightsUri: 'https://opensource.org/license/mit',
            rightsIdentifier: 'mit-license'
          }
        ]}
      />
    )

    cy.get('a[aria-label="View license details: MIT LICENSE"]')
      .should('have.attr', 'href', 'https://opensource.org/license/mit')
  })

  it('does not crash on malformed percent-encoded other rights identifiers', () => {
    mount(
      <License
        rights={[
          {
            rights: 'Bad License',
            rightsUri: 'https://example.com/license',
            rightsIdentifier: 'bad%zz-license'
          }
        ]}
      />
    )

    cy.get('a[aria-label="View license details: BAD%ZZ%20LICENSE"]')
      .should('have.attr', 'href', 'https://example.com/license')
  })
})
