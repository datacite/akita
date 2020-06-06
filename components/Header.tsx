import * as React from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'

type Props = {
  title: string
}

const Header: React.FunctionComponent<Props> = ({ title }: title) => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">{title}</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav pullRight>
      <NavItem eventKey={1} href="/about">
        About
      </NavItem>
      <NavItem eventKey={2} href="https://support.datacite.org/">
        Support
    </NavItem>
    </Nav>
  </Navbar>
)

export default Header
