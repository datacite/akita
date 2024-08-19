'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Navbar,
  Nav,
  Form
} from 'react-bootstrap-4'
import NavDropdown from 'react-bootstrap-4/NavDropdown'
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
import { session } from 'src/utils/session'
import styles from './Header.module.scss'
import { Container } from 'src/components/Layout-4'


type Props = {
  profilesUrl: string
  orcidUrl: string
}

export default function Header(props: Props) {
  const { profilesUrl, orcidUrl } = props
  const path = usePathname() || ''
  const base = path?.startsWith('/doi.org') ? '/doi.org'
    : path?.startsWith('/orcid.org') ? '/orcid.org'
      : path?.startsWith('/ror.org') ? '/ror.org'
        : path?.startsWith('/repositories') ? '/repositories'
          : '/';

  const user = session()

  return (
    <Container fluid>
      <Navbar collapseOnSelect className={styles.navbar}>
        <Navbar.Brand>
          <Link href="/">
            <img src="/images/commons-logo.svg" height="50" className="commons-logo" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className={styles.navcenter}>
          <Form inline>
            <Search base={base} />
            <Nav id="search-nav" activeKey={base} className={styles.navmain}>
              <Nav.Item>
                <Nav.Link
                  id="works-link"
                  eventKey={'/doi.org'}
                  href={'/doi.org'}
                  className="text-nowrap"
                >
                  <FontAwesomeIcon icon={faNewspaper} /> Works
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  id="people-link"
                  eventKey={'/orcid.org'}
                  href={'/orcid.org'}
                  className="text-nowrap"
                >
                  <FontAwesomeIcon icon={faUserGraduate} /> People
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  id="organizations-link"
                  eventKey={'/ror.org'}
                  href={'/ror.org'}
                  className="text-nowrap"
                >
                  <FontAwesomeIcon icon={faUniversity} /> Organizations
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  id="repositories-link"
                  eventKey={'/repositories'}
                  href={'/repositories'}
                  className="text-nowrap"
                >
                  <FontAwesomeIcon icon={faDatabase} /> Repositories
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Form>
          <Nav className={`hidden-mobile ${styles.navright} mt-3`}>
            <NavDropdown
              // eventKey={1}
              title="Pages"
              id="pages-dropdown"
              data-cy="pages"
              className={styles.navdropdown}
            >
              <NavDropdown.Item eventKey="1.1" data-cy="about" href="/about">
                About
              </NavDropdown.Item>
              <NavDropdown.Item eventKey="1.2" data-cy="statistics" href="/statistics">
                Statistics
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Item>
              <Nav.Link
                eventKey={2}
                data-cy="support"
                href="https://support.datacite.org/docs/datacite-commons"
                target="_blank"
                rel="noreferrer"
              >
                Support
              </Nav.Link>
            </Nav.Item>
            {user && (
              <NavDropdown title={user.name} id="basic-nav-dropdown">
                {user.beta_tester && (
                  <>
                    <NavDropdown.Item eventKey={3.1} data-cy="beta" href="/beta">
                      <FontAwesomeIcon icon={faUserTag} /> Beta Tester
                    </NavDropdown.Item>
                    <NavDropdown.Item divider />
                  </>
                )}
                <NavDropdown.Item
                  eventKey={3.2}
                  data-cy="settings"
                  href={profilesUrl + '/settings/me'}
                >
                  <FontAwesomeIcon icon={faUserCog} /> Settings
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey={3.3}
                  data-cy="commons-page"
                  href={'/orcid.org/' + user.uid}
                >
                  <FontAwesomeIcon icon={faAddressCard} /> Commons Page
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey={3.4}
                  data-cy="orcid"
                  href={orcidUrl + user.uid}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faOrcid} /> ORCID Record
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey={3.5}
                  data-cy="signout"
                  href={profilesUrl + '/sign_out'}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {!user && (
              <Nav.Item>
                <Nav.Link
                  id="sign-in"
                  className={`btn sign-in ${styles.signin}`}
                  href={profilesUrl + '/sign_in'}
                >
                  <FontAwesomeIcon icon={faSignInAlt} /> Sign In
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  )
}
