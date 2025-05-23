import React from 'react'
import Link from 'next/link'
import Search from 'src/components/Header/Search'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form';
import { Brand, Collapse, Toggle } from 'src/components/ReactBootstrap';

import NavLinks from 'src/components/Header/NavLinks'
import NavRight from 'src/components/Header/NavRight'
import UserDropdown from 'src/components/Header/Dropdown'
import { AboutLink, OrganizationsLink, PeopleLink, RepositoriesLink, SettingsButton, SignInButton, SignOutButton, StatisticsLink, SupportLink, WorksLink } from 'src/components/Header/ServerButtons';
import { UserCommonsPageButton, UserOrcidButton } from 'src/components/Header/ClientButtons';

import styles from './Header.module.scss'


export default function Header() {
  return (
    <Container fluid>
      <Navbar expand="lg" className={styles.navbar}>
        <Brand>
          <Link href="/">
            <img src="/images/commons-logo.svg" height="50" className="commons-logo" />
          </Link>
        </Brand>
        <Toggle />
        <Collapse className={`${styles.navcenter} gap-5`}>

          {/* Search and main links */}
          <Form className={`${styles.navsearchlinks} form-inline`}>
            <Search />
            <NavLinks>
              <WorksLink />
              <PeopleLink />
              <OrganizationsLink />
              <RepositoriesLink />
            </NavLinks>
          </Form>

          {/* Pages dropdown, support button, and right content */}
          <Nav className={`hidden-mobile ${styles.navright}`}>
            <NavDropdown
              title="Pages"
              id="pages-dropdown"
              data-cy="pages"
              className={styles.navdropdown}
            >
              <AboutLink />
              <StatisticsLink />
            </NavDropdown>

            <SupportLink />

            <NavRight
              signedInContent={
                <UserDropdown>
                  <SettingsButton />
                  <UserCommonsPageButton />
                  <UserOrcidButton />
                  <SignOutButton />
                </UserDropdown>
              }

              signedOutContent={<SignInButton />}
            />
          </Nav>
        </Collapse>
      </Navbar>
    </Container>
  )
}
