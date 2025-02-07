import React from 'react';
import { DropdownItem, NavItem, NavLink } from 'src/components/ReactBootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import {
  faNewspaper,
  faUserGraduate,
  faUniversity,
  faDatabase,
  faSignOutAlt,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import styles from './Header.module.scss'



export function WorksLink() {
  return <NavItem>
    <NavLink
      id="works-link"
      eventKey={'/doi.org'}
      href={'/doi.org'}
      className="text-nowrap"
      as={Link}
    >
      <FontAwesomeIcon icon={faNewspaper} /> Works
    </NavLink>
  </NavItem>
}

export function PeopleLink() {
  return <NavItem>
    <NavLink
      id="people-link"
      eventKey={'/orcid.org'}
      href={'/orcid.org'}
      className="text-nowrap"
      as={Link}
    >
      <FontAwesomeIcon icon={faUserGraduate} /> People
    </NavLink>
  </NavItem>
}

export function OrganizationsLink() {
  return <NavItem>
    <NavLink
      id="organizations-link"
      eventKey={'/ror.org'}
      href={'/ror.org'}
      className="text-nowrap"
      as={Link}
    >
      <FontAwesomeIcon icon={faUniversity} /> Organizations
    </NavLink>
  </NavItem>
}

export function RepositoriesLink() {
  return <NavItem>
    <NavLink
      id="repositories-link"
      eventKey={'/repositories'}
      href={'/repositories'}
      className="text-nowrap"
      as={Link}
    >
      <FontAwesomeIcon icon={faDatabase} /> Repositories
    </NavLink>
  </NavItem>
}


export function AboutLink() {
  return <DropdownItem eventKey="1.1" data-cy="about" href="/about">
    About
  </DropdownItem>
}

export function StatisticsLink() {
  return <DropdownItem eventKey="1.2" data-cy="statistics" href="/statistics">
    Statistics
  </DropdownItem>
}

export function SupportLink() {
  return <NavItem>
    <NavLink
      eventKey={2}
      data-cy="support"
      href="https://support.datacite.org/docs/datacite-commons"
      target="_blank"
      rel="noreferrer"
    >
      Support
    </NavLink>
  </NavItem>

}


export function SettingsButton({ profilesUrl }: { profilesUrl: string }) {
  return <DropdownItem
    eventKey={3.2}
    data-cy="settings"
    href={profilesUrl + '/settings/me'}
  >
    <FontAwesomeIcon icon={faUserCog} /> Settings
  </DropdownItem>
}


export function SignInButton({ profilesUrl }: { profilesUrl: string }) {
  return <NavItem>
    <NavLink
      id="sign-in"
      className={`btn sign-in ${styles.signin}`}
      href={profilesUrl + '/sign_in'}
    >
      <FontAwesomeIcon icon={faSignInAlt} /> Sign In
    </NavLink>
  </NavItem>
}

export function SignOutButton({ profilesUrl }: { profilesUrl: string }) {
  return <DropdownItem
    eventKey={3.5}
    data-cy="signout"
    href={profilesUrl + '/sign_out'}
  >
    <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
  </DropdownItem>
}
