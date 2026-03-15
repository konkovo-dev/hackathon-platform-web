import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setNavigatingAfterAuth, resetNavigatingAfterAuth } from './providers'

describe('Auth navigation flag', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    resetNavigatingAfterAuth()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should set flag and clear it after 1000ms', () => {
    setNavigatingAfterAuth()

    expect(vi.getTimerCount()).toBe(1)

    vi.advanceTimersByTime(500)
    expect(vi.getTimerCount()).toBe(1)

    vi.advanceTimersByTime(500)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('should allow multiple calls without breaking timer', () => {
    setNavigatingAfterAuth()
    setNavigatingAfterAuth()

    expect(vi.getTimerCount()).toBe(2)

    vi.advanceTimersByTime(1000)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('should allow manual reset', () => {
    setNavigatingAfterAuth()
    expect(vi.getTimerCount()).toBe(1)

    resetNavigatingAfterAuth()
    expect(vi.getTimerCount()).toBe(1)

    vi.advanceTimersByTime(1000)
    expect(vi.getTimerCount()).toBe(0)
  })
})
