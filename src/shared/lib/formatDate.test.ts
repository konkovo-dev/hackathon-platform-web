import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { formatRelativeTime, isoToDatetimeLocal } from './formatDate'

describe('isoToDatetimeLocal', () => {
  it('возвращает пустую строку для undefined и пустой строки', () => {
    expect(isoToDatetimeLocal(undefined)).toBe('')
    expect(isoToDatetimeLocal('')).toBe('')
  })

  it('возвращает пустую строку для невалидной ISO-строки', () => {
    expect(isoToDatetimeLocal('invalid')).toBe('')
  })

  it('конвертирует UTC в локальное время (формат YYYY-MM-DDTHH:mm)', () => {
    const iso = '2025-03-18T18:00:00.000Z'
    const result = isoToDatetimeLocal(iso)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    // Круговая проверка: локальное значение при парсинге даёт тот же момент
    expect(new Date(result).getTime()).toBe(new Date(iso).getTime())
  })
})

describe('formatRelativeTime', () => {
  const mockNow = new Date('2026-03-15T12:00:00Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockNow)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('должен возвращать "сейчас" для времени меньше минуты назад', () => {
    const date = new Date(mockNow.getTime() - 30 * 1000) // 30 секунд назад
    expect(formatRelativeTime(date, 'ru')).toBe('сейчас')
  })

  it('должен возвращать "now" для времени меньше минуты назад (en)', () => {
    const date = new Date(mockNow.getTime() - 30 * 1000)
    expect(formatRelativeTime(date, 'en')).toBe('now')
  })

  it('должен возвращать "1 минуту назад"', () => {
    const date = new Date(mockNow.getTime() - 1 * 60 * 1000)
    expect(formatRelativeTime(date, 'ru')).toBe('1 минуту назад')
  })

  it('должен возвращать "3 минуты назад"', () => {
    const date = new Date(mockNow.getTime() - 3 * 60 * 1000)
    expect(formatRelativeTime(date, 'ru')).toBe('3 минуты назад')
  })

  it('должен возвращать "5 минут назад"', () => {
    const date = new Date(mockNow.getTime() - 5 * 60 * 1000)
    expect(formatRelativeTime(date, 'ru')).toBe('5 минут назад')
  })

  it('должен возвращать "1 час назад"', () => {
    const date = new Date(mockNow.getTime() - 1 * 60 * 60 * 1000)
    expect(formatRelativeTime(date, 'ru')).toBe('1 час назад')
  })

  it('должен возвращать "3 часа назад"', () => {
    const date = new Date(mockNow.getTime() - 3 * 60 * 60 * 1000)
    expect(formatRelativeTime(date, 'ru')).toBe('3 часа назад')
  })

  it('должен возвращать "5 часов назад"', () => {
    const date = new Date(mockNow.getTime() - 5 * 60 * 60 * 1000)
    expect(formatRelativeTime(date, 'ru')).toBe('5 часов назад')
  })

  it('должен возвращать дату в формате дд.мм для даты более 24 часов назад', () => {
    const date = new Date('2026-03-10T12:00:00Z') // 5 дней назад
    expect(formatRelativeTime(date, 'ru')).toBe('10.03')
  })

  it('должен возвращать дату с годом для даты прошлого года', () => {
    const date = new Date('2025-12-25T12:00:00Z')
    expect(formatRelativeTime(date, 'ru')).toBe('25.12.2025')
  })

  it('должен обрабатывать строковую дату', () => {
    const dateStr = new Date(mockNow.getTime() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(dateStr, 'ru')).toBe('5 минут назад')
  })

  it('должен возвращать пустую строку для невалидной даты', () => {
    expect(formatRelativeTime('invalid-date', 'ru')).toBe('')
  })
})
