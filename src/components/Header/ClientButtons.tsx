'use client'

import React from 'react';
import { DropdownItem } from 'src/components/ReactBootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'

import { session } from "src/utils/session";

export function UserCommonsPageButton() {
  const user = session()

  return <DropdownItem
    eventKey={3.3}
    data-cy="commons-page"
    href={'/orcid.org/' + user.uid}
  >
    <FontAwesomeIcon icon={faAddressCard} /> Commons Page
  </DropdownItem>
}


export function UserOrcidButton({ orcidUrl }: { orcidUrl: string }) {
  const user = session()

  return <DropdownItem
    eventKey={3.4}
    data-cy="orcid"
    href={orcidUrl + user.uid}
    target="_blank"
    rel="noreferrer"
  >
    <FontAwesomeIcon icon={faOrcid} /> ORCID Record
  </DropdownItem>
}
