import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

type Props = {
  path: string
}

const SearchBox: React.FunctionComponent<Props> = ({ path }) => {
  const router = useRouter()

  const [searchInput, setSearchInput] = useState('' || router.query.filterQuery)

  const onSubmit = () => {
    if (router) {
      router.push({
        pathname: path,
        query: { filterQuery: searchInput }
      })
    }
  }

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
    router.replace(path, undefined, { shallow: true });
  }

  return (
    <>
      <h4>Filter Works</h4>
      <InputGroup>
        <input
          name="query-facets"
          value={searchInput}
          onChange={onSearchChange}
          key="searchInput"
          onKeyDown={onKeyDown}
          placeholder="Type to search..."
          className="form-control"
          type="text"
        />
        <Button
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
    </>
  )
}

export default SearchBox
