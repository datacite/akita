'use client'

import { PropsWithChildren } from 'react'
import { session } from 'src/utils/session'
import NavDropdown from 'react-bootstrap/NavDropdown'

export default function UserDropdown({ children }: PropsWithChildren) {
  const user = session()

  return <NavDropdown title={user.name} id="basic-nav-dropdown">
    {children}
  </NavDropdown>
}
