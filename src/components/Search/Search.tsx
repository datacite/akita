import * as React from 'react'
import { useQueryState } from 'next-usequerystate'
import { Row, Col, TabContent, TabPane, TabContainer, Nav, NavItem } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import SearchContent from '../SearchContent/SearchContent'
import SearchOrganization from '../SearchOrganization/SearchOrganization'
import SearchPerson from '../SearchPerson/SearchPerson'
import About from '../About/About'

const Search: React.FunctionComponent = () => {
  //const router = useRouter()
  const [searchQuery, setSearchQuery] = useQueryState('query', {
    history: 'push'
  })

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearchQuery(e.currentTarget.value)
  }

  const onSearchClear = () => {
    setSearchQuery('')
  }

  return (
    <TabContainer defaultActiveKey="content" id="search-tabs">
      <React.Fragment>
        <Row>
          <Col md={6} mdOffset={3}>
            <form className="form-horizontal search">
              <input
                name="query"
                value={searchQuery || ''}
                onChange={onSearchChange}
                placeholder="Type to search..."
                className="form-control"
                type="text"
              />
              <span id="search-icon" title="Search" aria-label="Search">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              {searchQuery && (
                <span
                  id="search-clear"
                  title="Clear"
                  aria-label="Clear"
                  onClick={onSearchClear}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              )}
            </form>

            <Nav bsStyle="tabs" id="search-nav">
              <NavItem eventKey="content">Content</NavItem>
              <NavItem eventKey="people">People</NavItem>
              <NavItem eventKey="organizations">Organizations</NavItem>
            </Nav>
          </Col>
        </Row>
        
        <TabContent animation>
          <TabPane eventKey="content">
            <React.Fragment>
              {!searchQuery || searchQuery === ' ' ? (
                <About title={'Introduction'} />
              ) : (
                <SearchContent searchQuery={searchQuery} />
              )}
            </React.Fragment>
          </TabPane>
          <TabPane eventKey="people">
            <React.Fragment>
              {!searchQuery || searchQuery === ' ' ? (
                <About title={'Introduction'} />
              ) : (
                <SearchPerson searchQuery={searchQuery} />
              )}
            </React.Fragment>
          </TabPane>
          <TabPane eventKey="organizations">
            <React.Fragment>
              {!searchQuery || searchQuery === ' ' ? (
                <About title={'Introduction'} />
              ) : (
                <SearchOrganization searchQuery={searchQuery} />
              )}
            </React.Fragment>
          </TabPane>
        </TabContent>
      </React.Fragment>
    </TabContainer>
  )
}

export default Search
