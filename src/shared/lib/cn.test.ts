import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('should merge tailwind classes with twMerge', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('should handle empty input', () => {
    expect(cn()).toBe('')
  })

  it('should handle array of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('should merge conflicting padding classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  it('should merge conflicting margin classes', () => {
    expect(cn('m-2', 'm-6')).toBe('m-6')
  })

  it('should keep non-conflicting classes', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  it('should handle object notation', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })
})
