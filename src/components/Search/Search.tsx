import * as React from 'react'
import { useQueryState } from 'next-usequerystate'
import { Row, Col, Tab, Tabs } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import SearchContent from '../SearchContent/SearchContent'
import SearchOrganization from '../SearchOrganization/SearchOrganization'
import SearchPerson from '../SearchPerson/SearchPerson'

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
          <p>DataCite Commons is a web search interface for the <a href="https://doi.org/10.5438/jwvf-8a66" target="_blank" rel="noreferrer">PID Graph</a>, 
          the graph formed by the collection of scholarly resources such as
          publications, datasets, people and research organizations, and their connections. The PID Graph
          uses persistent identifiers and <a href="https://graphql.org/" target="_blank" rel="noreferrer">GraphQL</a>, 
          with PIDs and metadata provided by DataCite, Crossref, ORCID, and others.</p> 
          <p>DataCite Commons is work in progress and will officially launch in October 2020. The work is
          supported by funding from the European Union’s Horizon 2020 research and innovation programme.</p>
          <p><a href="https://portal.productboard.com/71qotggkmbccdwzokuudjcsb/c/35-common-doi-search" target="_blank" rel="noreferrer">Provide input to the DataCite Roadmap</a> | <a href="https://support.datacite.org/docs/datacite-search-user-documentation" target="_blank" rel="noreferrer">Information in DataCite Support</a></p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Row>
        <Col md={3}></Col>
        <Col md={6}>
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
        <Col></Col>
        <Col>

          <Tabs defaultActiveKey="content" id="noanim-tab-example">
            <Tab eventKey="people" title="People">
              {!searchQuery || searchQuery === " "
                ? (renderIntroduction())
                : (<SearchPerson searchQuery={searchQuery} />)
              }
            </Tab>
            <Tab eventKey="content" title="Content">
              {!searchQuery || searchQuery === " "
                ? (renderIntroduction())
                : (<SearchContent searchQuery={searchQuery} />)
              }
            </Tab>
            <Tab eventKey="organisations" title="Organisations">
              {!searchQuery || searchQuery === " "
                ? (renderIntroduction())
                : (<SearchOrganization searchQuery={searchQuery} />)
              }
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  )
}

export default Search
