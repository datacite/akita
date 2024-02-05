import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

type Props = {
  path: string
}

export default function SearchBox ({ path }: Props) {
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

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setSearchInput(e.currentTarget.value)
  }

  const onSearchClear = () => {
    setSearchInput('')
    router.replace(path);
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
    </>
  )
}
