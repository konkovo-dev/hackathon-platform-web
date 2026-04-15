import { describe, it, expect } from 'vitest'
import { getCityApiFilterValues } from './getCityApiFilterValues'

describe('getCityApiFilterValues', () => {
  it('returns RU and EN names for a catalog city (Russian label)', () => {
    expect(getCityApiFilterValues('Москва')).toEqual(['Москва', 'Moscow'])
  })

  it('returns RU and EN names when city is passed in English', () => {
    expect(getCityApiFilterValues('Moscow')).toEqual(['Москва', 'Moscow'])
  })

  it('returns a single string for cities not in the catalog', () => {
    expect(getCityApiFilterValues('Тверь')).toEqual(['Тверь'])
  })
})
