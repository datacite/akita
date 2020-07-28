import * as React from 'react'
import { useQueryState } from 'next-usequerystate'
import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import SearchContent from '../SearchContent/SearchContent'
import SearchOrganization from '../SearchOrganization/SearchOrganization'
// import SearchPerson from '../SearchPerson/SearchPerson'

const Search: React.FunctionComponent = () => {
  //const router = useRouter()
  const [searchQuery, setSearchQuery] = useQueryState("query", { history: 'push' })

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearchQuery(e.currentTarget.value)
  }

  const onSearchClear = () => {
    setSearchQuery('')
  }


  const renderIntroduction = () => {
    return (
      <div className="panel panel-transparent">
        <div className="panel-body">
          <h3 className="member">Introduction</h3>
          <p>DataCite Commons is a web interface where you can explore the complete
          collection of publicly available DOIs from DOI registation agencies DataCite
          and Crossref. You can search, filter, cite results, and more!</p>
          <p>DataCite Commons is work in progress and will officially launch in October 2020.</p>
          <p><a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input to the DataCite Roadmap</a> | <a href="https://support.datacite.org/docs/datacite-search-user-documentation" target="_blank" rel="noreferrer">Information in DataCite Support</a></p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Row>
        <Col md={9}>
          <form className="form-horizontal search">
            <input name="query" value={searchQuery || ''} onChange={onSearchChange} placeholder="Type to search..." className="form-control" type="text" />
            <span id="search-icon" title="Search" aria-label="Search">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            {searchQuery &&
              <span id="search-clear" title="Clear" aria-label="Clear" onClick={onSearchClear}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            }
          </form>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* {!searchQuery
            ? renderIntroduction()
            : <SearchContent searchQuery={searchQuery} />
          } */}
          <SearchOrganization searchQuery={searchQuery} />
          {/* <SearchPerson searchQuery={searchQuery} /> */}
        </Col>
      </Row>
    </div>
  )
}

export default Search
