'use client'

import React from 'react';
import { DropdownItem } from 'src/components/ReactBootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import { ORCID_URL } from 'src/data/constants';
import { session } from "src/utils/session";

export function UserCommonsPageButton() {
  const user = session()
  if (!user) throw new Error("User not signed in")
  const href = '/orcid.org/' + user.uid

  return <DropdownItem href={href} eventKey={3.3} data-cy="commons-page">
    <FontAwesomeIcon icon={faAddressCard} /> Commons Page
  </DropdownItem>
}


export function UserOrcidButton() {
  const user = session()
  if (!user) throw new Error("User not signed in")
  const href = `${ORCID_URL}/${user.uid}`

  return <DropdownItem
    href={href}
    target="_blank"
    rel="noreferrer"
    eventKey={3.4}
    data-cy="orcid"
  >
    <FontAwesomeIcon icon={faOrcid} /> ORCID Record
  </DropdownItem>
}
