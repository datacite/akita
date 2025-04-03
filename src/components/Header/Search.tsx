'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
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

  // Update searchInput when URL changes (e.g., back button)
  React.useEffect(() => {
    const queryParam = searchParams?.get('query')?.toString() || ''
    if (searchInput !== queryParam) {
      setSearchInput(queryParam)
    }
  }, [searchParams])

  function search(query: string) {
    const params = new URLSearchParams(searchParams || {});

    if (searchInput) params.set('query', query);
    else params.delete('query');

    router.push(`${base}?${params.toString()}`);
  }

  return (
    <InputGroup className="flex-nowrap align-items-center">
      <input
        name="query"
        placeholder="Type to search..."
        value={searchInput}
        onChange={e => {
          setSearchInput(e.target.value)
        }}
        key="searchInput"
        className={`form-control ${styles.input}`}
        type="text"
      />
      <Button type="submit" className={`search-submit ${styles.submit}`} onClick={(e) => {
        search(searchInput)
        e.preventDefault();
      }}
      >
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
