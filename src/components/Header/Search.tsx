'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import { InputGroup, Button } from 'react-bootstrap'
import styles from './Search.module.css'

export default function Search() {
  const path = usePathname() || ''
  const base = path?.startsWith('/doi.org') ? '/doi.org'
    : path?.startsWith('/orcid.org') ? '/orcid.org'
      : path?.startsWith('/ror.org') ? '/ror.org'
        : path?.startsWith('/repositories') ? '/repositories'
          : '/';

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
    <InputGroup className="flex-nowrap align-items-center">
      <input
        name="query"
        placeholder="Type to search..."
        value={searchInput}
        onChange={e => {
          setSearchInput(e.target.value)
          debounceSearch(e.target.value)
        }}
        key="searchInput"
        className={`form-control ${styles.input}`}
        type="text"
      />
      <Button type="submit" className={`search-submit ${styles.submit}`} onClick={() => search(searchInput)}>
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
