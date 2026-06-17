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
  const [isFocused, setIsFocused] = useState(false)

  // Update searchInput when URL changes (e.g., back button), but not while typing
  React.useEffect(() => {
    if (isFocused) return
    const queryParam = searchParams?.get('query')?.toString() || ''
    setSearchInput((current) => (current !== queryParam ? queryParam : current))
  }, [searchParams, isFocused])

  function search(query: string) {
    const params = new URLSearchParams(searchParams || {})

    if (query) params.set('query', query)
    else params.delete('query')

    const queryString = params.toString()
    router.push(queryString ? `${base}?${queryString}` : base)
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        key="searchInput"
        className={`form-control ${styles.input}`}
        type="text"
        title="Primary search"
        aria-label="Primary search input field"
      />
      {searchInput !== '' && (
        <Button
          id="search-clear"
          type="button"
          title="Clear search"
          aria-label="Clear search"
          onClick={() => {
            setSearchInput('')
            search('')
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      )}
      <Button type="submit" aria-label="Search" className={`search-submit ${styles.submit}`} onClick={(e) => {
        search(searchInput)
        e.preventDefault();
      }}
      >
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </InputGroup>
  )
}
