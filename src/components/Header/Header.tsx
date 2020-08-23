import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Navbar, Nav, NavItem, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch, faNewspaper, faUserGraduate, faUniversity, faMapMarker } from '@fortawesome/free-solid-svg-icons'

type Props = {
  path: string
}

const Header: React.FunctionComponent<Props> = ({ path }) => {
  // store query in useState(), default is current query parameter
  // update query parameter only after submit
  // submit pushes new path instead of updating only query parameter,
  // to allow queries from Navbar when on a page for a single record
  let searchQuery = ''
  const paths = ['/', '/doi.org', '/orcid.org', '/ror.org']
  let onSubmit = () => {

  }
  
  const router = useRouter()
  if (router) {
    searchQuery = router.query.query as string  
    onSubmit = () => {
      router.push({
        pathname: path,
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
            <a href="/">DataCite Commons</a>
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
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Navbar fluid>
        <Navbar.Collapse>
          <div className="col-md-3"></div>
          <div className="col-md-9 search-nav">
            <Nav id="search-nav" activeKey={path}>
              {!paths.includes(path) && (
                <NavItem id='this-link' eventKey={path} href={path + '?query=' + searchInput}><FontAwesomeIcon icon={faMapMarker} /> This Page</NavItem>
              )}
              <NavItem id='works-link' eventKey={'/doi.org'} href={'/doi.org?query=' + searchInput}><FontAwesomeIcon icon={faNewspaper} /> Works</NavItem>
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
