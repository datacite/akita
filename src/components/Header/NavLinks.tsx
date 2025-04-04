'use client'

import React, { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import Nav from 'react-bootstrap/Nav';
import styles from './Header.module.scss'

export default function NavLinks({ children }: PropsWithChildren) {
  const path = usePathname() || ''
  const base = path?.startsWith('/doi.org') ? '/doi.org'
    : path?.startsWith('/orcid.org') ? '/orcid.org'
      : path?.startsWith('/ror.org') ? '/ror.org'
        : path?.startsWith('/repositories') ? '/repositories'
          : '/';

  return <Nav id="search-nav" activeKey={base} className={styles.navmain}>
    {children}
  </Nav>
}
