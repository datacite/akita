'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap'
import Search from 'src/components/Header/Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignInAlt,
  faSignOutAlt,
  faUserCog,
  faUserTag,
  faAddressCard,
  faNewspaper,
  faUserGraduate,
  faUniversity,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

type Props = {
  profilesUrl: string
  orcidUrl: string
  user: any
}

export default function Header (props: Props) {
  const { profilesUrl, orcidUrl, user } = props
  const path = usePathname() || ''
  const base = path?.startsWith('/doi.org') ? '/doi.org'
    : path?.startsWith('/orcid.org') ? '/orcid.org'
    : path?.startsWith('/ror.org') ? '/ror.org'
    : path?.startsWith('/repositories') ? '/repositories'
    : '/';

  return (
    <Navbar fluid collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <Link href="/">
            <img src="/images/commons-logo.svg" height="50" className="commons-logo"/>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Navbar.Form pullLeft>
          <Search base={base} />
          <div>
            <Nav id="search-nav" activeKey={base}>
              <NavItem
                id="works-link"
                eventKey={'/doi.org'}
                href={'/doi.org'}
              >
                <FontAwesomeIcon icon={faNewspaper} /> Works
              </NavItem>
              <NavItem
                id="people-link"
                eventKey={'/orcid.org'}
                href={'/orcid.org'}
              >
                <FontAwesomeIcon icon={faUserGraduate} /> People
              </NavItem>
              <NavItem
                id="organizations-link"
                eventKey={'/ror.org'}
                href={'/ror.org'}
              >
                <FontAwesomeIcon icon={faUniversity} /> Organizations
              </NavItem>
                <NavItem
                  id="repositories-link"
                  eventKey={'/repositories'}
                  href={'/repositories'}
                >
                  <FontAwesomeIcon icon={faDatabase} /> Repositories
                </NavItem>
            </Nav>
          </div>
        </Navbar.Form>
        <Nav className="hidden-mobile" pullRight>
          <NavDropdown
            eventKey={1}
            title="Pages"
            id="pages-dropdown"
            data-cy="pages"
          >
            <MenuItem eventKey={1.1} data-cy="about" href="/about">
              About
            </MenuItem>
            <MenuItem eventKey={1.2} data-cy="statistics" href="/statistics">
              Statistics
            </MenuItem>
          </NavDropdown>
          <NavItem
            eventKey={2}
            data-cy="support"
            href="https://support.datacite.org/docs/datacite-commons"
            target="_blank"
            rel="noreferrer"
          >
            Support
          </NavItem>
          {user && (
            <NavDropdown eventKey={3} title={user.name} id="basic-nav-dropdown">
              {user.beta_tester && (
                <>
                  <MenuItem eventKey={3.1} data-cy="beta" href="/beta">
                    <FontAwesomeIcon icon={faUserTag} /> Beta Tester
                  </MenuItem>
                  <MenuItem divider />
                </>
              )}
              <MenuItem
                eventKey={3.2}
                data-cy="settings"
                href={profilesUrl + '/settings/me'}
              >
                <FontAwesomeIcon icon={faUserCog} /> Settings
              </MenuItem>
              <MenuItem
                eventKey={3.3}
                data-cy="commons-page"
                href={'/orcid.org/' + user.uid}
              >
                <FontAwesomeIcon icon={faAddressCard} /> Commons Page
              </MenuItem>
              <MenuItem
                eventKey={3.4}
                data-cy="orcid"
                href={orcidUrl + user.uid}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faOrcid} /> ORCID Record
              </MenuItem>
              <MenuItem
                eventKey={3.5}
                data-cy="signout"
                href={profilesUrl + '/sign_out'}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
              </MenuItem>
            </NavDropdown>
          )}
          {!user && (
            <NavItem
              id="sign-in"
              className="btn sign-in"
              href={profilesUrl + '/sign_in'}
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Sign In
            </NavItem>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
