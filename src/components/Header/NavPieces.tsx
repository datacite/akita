'use client'
// This is required to fix a bug with react-bootstrap in server components
// https://github.com/react-bootstrap/react-bootstrap/issues/6475#issuecomment-1676154096

import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'

export const NavItem = Nav.Item
export const NavLink = Nav.Link
export const Brand = Navbar.Brand
export const Toggle = Navbar.Toggle
export const Collapse = Navbar.Collapse
export const DropdownItem = NavDropdown.Item
