import * as React from 'react'
import { Navbar, Nav, NavItem, Popover, OverlayTrigger } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

type Props = {
  title: string
}

const signIn = (
  <Popover id="sign-in" title="Personal Accounts">
    Personal accounts will be implemented later in 2020.{' '}
    <a
      href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search"
      target="_blank"
      rel="noreferrer"
    >
      Provide input
    </a>
  </Popover>
)

const Header: React.FunctionComponent<Props> = ({ title }: typeof title) => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">{title}</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <NavItem eventKey={1} data-cy="about" href="/about">
          About
        </NavItem>
        <NavItem
          eventKey={2}
          data-cy="support"
          href="https://support.datacite.org/"
        >
          Support
        </NavItem>
        <OverlayTrigger trigger="click" placement="bottom" overlay={signIn}>
          <Navbar.Text className="btn btn-sm">
            <FontAwesomeIcon icon={faSignInAlt} /> Sign In
          </Navbar.Text>
        </OverlayTrigger>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Header
