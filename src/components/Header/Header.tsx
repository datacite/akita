import React from 'react'
import Link from 'next/link'
import Search from 'src/components/Header/Search'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { Brand, Collapse, Toggle } from 'src/components/ReactBootstrap';

import NavLinks from 'src/components/Header/NavLinks'
import NavRight from 'src/components/Header/NavRight'
import UserDropdown from 'src/components/Header/Dropdown'
import { OrganizationsLink, PeopleLink, RepositoriesLink, SettingsButton, SignInButton, SignOutButton, SupportLink, WorksLink } from 'src/components/Header/ServerButtons';
import { UserCommonsPageButton, UserOrcidButton } from 'src/components/Header/ClientButtons';

import styles from './Header.module.scss'


export default function Header() {
  return (
    <Container fluid>
      <Navbar expand="lg" className={`${styles.navbar} justify-content-between`}>
        <Brand>
          <Link href="/">
            <img src="/images/commons-logo.svg" height="50" className="commons-logo" />
          </Link>
        </Brand>   
        <Toggle />
        <Collapse className="align-items-start">
          <Form className={`${styles.navsearchlinks} form-inline mx-auto`}>
            <Search />
            <NavLinks>
              <WorksLink />
              <PeopleLink />
              <OrganizationsLink />
              <RepositoriesLink />
            </NavLinks>
          </Form>
          <Nav className={`hidden-mobile ${styles.navright}`}>
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
