import { describe, expect, it } from 'vitest'
import {
  IMAGE_MIME_TYPES,
  MAX_AVATAR_SIZE_BYTES,
  validateImageFile,
} from '@/shared/lib/file'

describe('validateImageFile', () => {
  function makeFile(name: string, type: string, size: number): File {
    return new File([new Uint8Array(size)], name, { type })
  }

  it('returns null for valid jpeg within limit', () => {
    expect(validateImageFile(makeFile('a.jpg', 'image/jpeg', 100))).toBeNull()
  })

  it('returns invalid_type for disallowed mime', () => {
    expect(validateImageFile(makeFile('a.pdf', 'application/pdf', 100))).toBe('invalid_type')
  })

  it('returns too_large when size exceeds max', () => {
    expect(
      validateImageFile(makeFile('a.jpg', 'image/jpeg', MAX_AVATAR_SIZE_BYTES + 1))
    ).toBe('too_large')
  })

  it('respects custom maxBytes and allowedTypes', () => {
    const file = makeFile('a.png', 'image/png', 2000)
    expect(validateImageFile(file, { maxBytes: 1000 })).toBe('too_large')
    expect(validateImageFile(file, { allowedTypes: ['image/jpeg'] })).toBe('invalid_type')
    expect(IMAGE_MIME_TYPES).toContain('image/webp')
  })
})
