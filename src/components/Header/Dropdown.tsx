'use client'

import React, { PropsWithChildren } from 'react'
import { useSession } from 'src/utils/session'
import NavDropdown from 'react-bootstrap/NavDropdown'

export default function UserDropdown({ children }: PropsWithChildren) {
  const { user, loading } = useSession()
  if (loading) return null // Or return a loading skeleton
  if (!user) throw new Error("User not signed in")

  return <NavDropdown title={user.name} className="my-4" id="basic-nav-dropdown">
    {children}
  </NavDropdown>
}
