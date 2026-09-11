import React from 'react'
import { mount } from '@cypress/react'
import CommonsLayout from './CommonsLayout'

describe('CommonsLayout Component', () => {
  it('sidebar mode renders a 3/9 column split in a fluid container', () => {
    mount(
      <CommonsLayout sidebar={<span id="sidebar">Sidebar</span>}>
        <span id="main">Main</span>
      </CommonsLayout>
    )
    cy.get('.container-fluid > .row > .col-md-3')
      .should('contain', 'Sidebar')
      .and('have.class', 'd-none')
      .and('have.class', 'd-md-block')
      .and('have.class', 'pe-4')
    cy.get('.col-md-9').should('contain', 'Main').and('not.have.class', 'pe-4')
  })

  it('main-only mode renders a single offset column', () => {
    mount(
      <CommonsLayout>
        <span id="main">Main</span>
      </CommonsLayout>
    )
    cy.get('.container-fluid > .row > .col-md-9.offset-md-3')
      .find('span#main')
      .should('contain', 'Main')
      .and('have.attr', 'id', 'main')
    cy.get('.col-md-3').should('not.exist')
  })

  it('applies column class overrides and can omit the container', () => {
    mount(
      <CommonsLayout
        fluid={false}
        sidebar={<span>Sidebar</span>}
        sidebarClassName="px-4"
        mainClassName="px-0"
      >
        <span>Main</span>
      </CommonsLayout>
    )
    cy.get('.container-fluid').should('not.exist')
    cy.get('[data-cy-root] .row > .col-md-3')
      .should('have.class', 'px-4')
      .and('not.have.class', 'pe-4')
    cy.get('.col-md-9').should('have.class', 'px-0')
  })
})
