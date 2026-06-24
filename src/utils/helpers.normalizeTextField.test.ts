/// <reference types="cypress" />

import { normalizeTextField } from 'src/utils/helpers'

describe('normalizeTextField', () => {
  it('returns plain strings unchanged', () => {
    expect(normalizeTextField('Example title')).to.eq('Example title')
  })

  it('returns empty string for null and undefined', () => {
    expect(normalizeTextField(null)).to.eq('')
    expect(normalizeTextField(undefined)).to.eq('')
  })

  it('joins string arrays and skips null, non-strings, and empty strings', () => {
    expect(
      normalizeTextField([
        'First paragraph.',
        null,
        '',
        42,
        'Second paragraph.',
      ])
    ).to.eq('First paragraph. Second paragraph.')
  })

  it('returns empty string for unexpected scalar types', () => {
    expect(normalizeTextField(42)).to.eq('')
    expect(normalizeTextField(true)).to.eq('')
  })
})
