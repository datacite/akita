import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
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

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
  const searchBoxStyle = {
    '--bs-heading-color': '#1abc9c',
    'border-bottom': '1px solid #cdd2d5',
    'padding-bottom': '0.35rem',
  } as React.CSSProperties;

  return (<>
    <h4 style={searchBoxStyle}>Filter Works</h4>
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
  </>)
}
