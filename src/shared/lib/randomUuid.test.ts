import { describe, it, expect } from 'vitest'
import { randomUUID } from './randomUuid'

const v4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('randomUUID', () => {
  it('returns a UUID v4-shaped string', () => {
    const id = randomUUID()
    expect(id).toMatch(v4)
  })

  it('returns unique values', () => {
    const a = new Set<string>()
    for (let i = 0; i < 50; i++) a.add(randomUUID())
    expect(a.size).toBe(50)
  })
})
