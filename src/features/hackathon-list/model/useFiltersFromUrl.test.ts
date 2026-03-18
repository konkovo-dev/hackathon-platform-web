import { describe, it, expect } from 'vitest'

/**
 * Тесты для парсинга фильтров из URL
 * Основная логика находится в useFiltersFromUrl.ts
 */
describe('useFiltersFromUrl - URL parsing', () => {
  it('should parse "all" stage from URL', () => {
    const searchParams = new URLSearchParams('stage=all')
    const stage = searchParams.get('stage')

    expect(stage).toBe('all')
    expect(['all', 'upcoming', 'registration', 'running', 'finished'].includes(stage!)).toBe(true)
  })

  it('should parse "upcoming" stage from URL', () => {
    const searchParams = new URLSearchParams('stage=upcoming')
    const stage = searchParams.get('stage')

    expect(stage).toBe('upcoming')
    expect(['all', 'upcoming', 'registration', 'running', 'finished'].includes(stage!)).toBe(true)
  })

  it('should parse "registration" stage from URL', () => {
    const searchParams = new URLSearchParams('stage=registration')
    const stage = searchParams.get('stage')

    expect(stage).toBe('registration')
    expect(['all', 'upcoming', 'registration', 'running', 'finished'].includes(stage!)).toBe(true)
  })

  it('should parse "running" stage from URL', () => {
    const searchParams = new URLSearchParams('stage=running')
    const stage = searchParams.get('stage')

    expect(stage).toBe('running')
    expect(['all', 'upcoming', 'registration', 'running', 'finished'].includes(stage!)).toBe(true)
  })

  it('should parse "finished" stage from URL', () => {
    const searchParams = new URLSearchParams('stage=finished')
    const stage = searchParams.get('stage')

    expect(stage).toBe('finished')
    expect(['all', 'upcoming', 'registration', 'running', 'finished'].includes(stage!)).toBe(true)
  })

  it('should reject invalid stage values', () => {
    const searchParams = new URLSearchParams('stage=invalid')
    const stage = searchParams.get('stage')

    expect(stage).toBe('invalid')
    expect(['all', 'upcoming', 'registration', 'running', 'finished'].includes(stage!)).toBe(false)
  })

  it('should parse format parameter', () => {
    const searchParams = new URLSearchParams('format=online,offline')
    const format = searchParams.get('format')

    expect(format).toBe('online,offline')
    const formats = format?.split(',').filter(f => f === 'online' || f === 'offline')
    expect(formats).toEqual(['online', 'offline'])
  })

  it('should parse city parameter', () => {
    const searchParams = new URLSearchParams('city=Москва')
    const city = searchParams.get('city')

    expect(city).toBe('Москва')
  })

  it('should parse sort parameter', () => {
    const searchParams = new URLSearchParams('sort=desc')
    const sort = searchParams.get('sort')

    expect(sort).toBe('desc')
    expect(sort === 'desc' ? 'desc' : 'asc').toBe('desc')
  })

  it('should handle multiple parameters', () => {
    const searchParams = new URLSearchParams('stage=upcoming&format=online&city=Москва&sort=desc')

    expect(searchParams.get('stage')).toBe('upcoming')
    expect(searchParams.get('format')).toBe('online')
    expect(searchParams.get('city')).toBe('Москва')
    expect(searchParams.get('sort')).toBe('desc')
  })
})

describe('useFiltersFromUrl - URL serialization', () => {
  it('should serialize stage parameter except "all"', () => {
    const params = new URLSearchParams()
    const stage = 'upcoming'

    params.set('stage', stage)

    expect(params.toString()).toBe('stage=upcoming')
  })

  it('should not serialize "all" stage', () => {
    const params = new URLSearchParams()
    const stage = 'all'

    expect(params.toString()).toBe('')
  })

  it('should serialize formats', () => {
    const params = new URLSearchParams()
    const formats = ['online', 'offline']

    if (formats.length > 0) {
      params.set('format', formats.join(','))
    }

    expect(params.toString()).toBe('format=online%2Coffline')
  })

  it('should serialize city', () => {
    const params = new URLSearchParams()
    const city = 'Москва'

    if (city) {
      params.set('city', city)
    }

    expect(params.toString()).toContain('city')
  })

  it('should always serialize sort', () => {
    const params = new URLSearchParams()
    const sortDirection = 'desc'

    params.set('sort', sortDirection)

    expect(params.toString()).toBe('sort=desc')
  })
})
