import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Col, Row, Button, InputGroup, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

interface Props {
  path: string
}

export default function SearchBox({ path }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const [searchInput, setSearchInput] = useState(params?.get('filterQuery') || '')

  const onSubmit = () => {
    if (router)
      router.push(`${path}?filterQuery=${searchInput}`)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit()
    }
  }

  const onSearchChange = (text: string): void => {
    setSearchInput(text)
  }

  const onSearchClear = () => {
    setSearchInput('')
    router.replace(path);
  }

  return (<>
    <Row><Col><h4>Filter Works</h4></Col></Row>
    <Row><Col>
      <InputGroup>
        <FormControl
          name="query-facets"
          value={searchInput}
          onChange={e => onSearchChange(e.currentTarget.value)}
          key="searchInput"
          onKeyDown={onKeyDown}
          placeholder="Type to search..."
          className="form-control"
          type="text"
        />
        <Button
          id="filter-works"
          type="submit"
          className="search-submit-facets"
          onClick={onSubmit}
        >
          <FontAwesomeIcon icon={faSearch} />
        </Button>
        {searchInput !== '' && (
          <span
            id="search-clear-facets"
            title="Clear"
            aria-label="Clear"
            onClick={onSearchClear}
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>
        )}
      </InputGroup>
    </Col></Row>
  </>)
}
