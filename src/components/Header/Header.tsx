import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Navbar, Nav, NavItem, Popover, OverlayTrigger, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faTimes, faSearch, faBook, faUserGraduate, faUniversity } from '@fortawesome/free-solid-svg-icons'

type Props = {
  title: string
}

const signIn = (
  <Popover id="sign-in" title="Personal Accounts">
    Personal accounts will be implemented later in 2020.{' '}
    <a
      href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search"
      target="_blank"
      rel="noreferrer"
    >
      Provide input
    </a>
  </Popover>
)

const Header: React.FunctionComponent<Props> = ({ title }) => {
  // store query in useState(), default is current query parameter
  // update query parameter only after submit
  // submit pushes new path instead of updating only query parameter,
  // to allow queries from Navbar when on a page for a single record
  let searchQuery = ''
  let pathname = '/'
  let onSubmit = () => {
    
  }
  
  const router = useRouter()
  if (router) {
    searchQuery = router.query.query as string
    switch(router.pathname) {
      case '/doi.org/[...doi]':
        pathname = '/doi.org'
        break
      case '/orcid.org/[person]':
        pathname = '/orcid.org'
        break
      case '/ror.org/[organization]':
        pathname = '/ror.org'
        break
      default:
        pathname = router.pathname
    }
  
    onSubmit = () => {
      router.push({
        pathname: pathname,
        query: { query: searchInput },
      })
    }
  }

  const [searchInput, setSearchInput] = useState(searchQuery || '')

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit()
    }
  }

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearchInput(e.currentTarget.value)
  }

  const onSearchClear = () => {
    setSearchInput('')
  }

  return (
    <React.Fragment>
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">{title}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullLeft>
            <InputGroup>
              <input
                name="query"
                value={searchInput}
                onChange={onSearchChange}
                key='searchInput'
                onKeyDown={onKeyDown}
                placeholder="Type to search..."
                className="form-control"
                type="text"
              />
              <Button type="submit" className="search-submit" onClick={onSubmit}><FontAwesomeIcon icon={faSearch} /></Button>
              {searchInput !== '' && (
                <span
                  id="search-clear"
                  title="Clear"
                  aria-label="Clear"
                  onClick={onSearchClear}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              )}
            </InputGroup>
          </Navbar.Form>
          <Nav pullRight>
            <NavItem eventKey={1} data-cy="about" href="/about">
              About
            </NavItem>
            <NavItem
              eventKey={2}
              data-cy="support"
              href="https://support.datacite.org/"
            >
              Support
            </NavItem>
            <OverlayTrigger trigger="click" placement="bottom" overlay={signIn}>
              <Navbar.Text className="btn btn-sm">
                <FontAwesomeIcon icon={faSignInAlt} /> Sign In
              </Navbar.Text>
            </OverlayTrigger>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Navbar fluid>
        <Navbar.Collapse>
          <div className="col-md-3"></div>
          <div className="col-md-9 search-nav">
            <Nav id="search-nav" activeKey={pathname}>
              <NavItem id='works-link' eventKey={'/doi.org'} href={'/doi.org?query=' + searchInput}><FontAwesomeIcon icon={faBook} /> Works</NavItem>
              <NavItem id='people-link' eventKey={'/orcid.org'} href={'/orcid.org?query=' + searchInput}><FontAwesomeIcon icon={faUserGraduate} /> People</NavItem>
              <NavItem id='organizations-link' eventKey={'/ror.org'} href={'/ror.org?query=' + searchInput}><FontAwesomeIcon icon={faUniversity} /> Organizations</NavItem>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </React.Fragment>
  )
}

export default Header
