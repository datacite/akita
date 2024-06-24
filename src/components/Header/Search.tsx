'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import { InputGroup, Button } from 'react-bootstrap-4'

interface Props {
  base: string
}

export default function Search({ base }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchInput, setSearchInput] = useState(searchParams?.get('query')?.toString() || '')

  function search(query: string) {
    const params = new URLSearchParams(searchParams || {});

    if (searchInput) params.set('query', query);
    else params.delete('query');

    router.push(`${base}?${params.toString()}`);
  }

  const debounceSearch = useDebouncedCallback(search, 300)

  return (
    <InputGroup>
      <input
        name="query"
        placeholder="Type to search..."
        value={searchInput}
        onChange={e => {
          setSearchInput(e.target.value)
          debounceSearch(e.target.value)
        }}
        key="searchInput"
        className="form-control"
        type="text"
      />
      <Button type="submit" className="search-submit" onClick={() => search(searchInput)}>
        <FontAwesomeIcon icon={faSearch} />
      </Button>
      {searchInput !== '' && (
        <span
          id="search-clear"
          title="Clear"
          aria-label="Clear"
          onClick={() => {
            setSearchInput('')
            search('')
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </span>
      )}
    </InputGroup>
  )
}
