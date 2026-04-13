import { describe, expect, it } from 'vitest'
import {
  IMAGE_MIME_TYPES,
  MAX_AVATAR_SIZE_BYTES,
  MAX_SUBMISSION_FILE_SIZE_BYTES,
  validateImageFile,
  validateSubmissionFile,
  resolveSubmissionContentType,
  fileLowerExtension,
  formatBinarySize,
  submissionFileFormatLabel,
  submissionFileMetaPlain,
  submissionFileMetaSuffix,
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
    expect(validateImageFile(makeFile('a.jpg', 'image/jpeg', MAX_AVATAR_SIZE_BYTES + 1))).toBe(
      'too_large'
    )
  })

  it('respects custom maxBytes and allowedTypes', () => {
    const file = makeFile('a.png', 'image/png', 2000)
    expect(validateImageFile(file, { maxBytes: 1000 })).toBe('too_large')
    expect(validateImageFile(file, { allowedTypes: ['image/jpeg'] })).toBe('invalid_type')
    expect(IMAGE_MIME_TYPES).toContain('image/webp')
  })
})

describe('submission file helpers', () => {
  function makeFile(name: string, type: string, size: number): File {
    return new File([new Uint8Array(size)], name, { type })
  }

  it('fileLowerExtension uses last suffix', () => {
    expect(fileLowerExtension('Report.PDF')).toBe('.pdf')
    expect(fileLowerExtension('archive.tar.gz')).toBe('.gz')
  })

  it('validateSubmissionFile accepts pdf with matching mime', () => {
    expect(validateSubmissionFile(makeFile('x.pdf', 'application/pdf', 10))).toBeNull()
  })

  it('validateSubmissionFile rejects disallowed extension', () => {
    expect(validateSubmissionFile(makeFile('x.exe', 'application/octet-stream', 10))).toBe(
      'invalid_type'
    )
  })

  it('validateSubmissionFile rejects oversize', () => {
    expect(
      validateSubmissionFile(
        makeFile('x.pdf', 'application/pdf', MAX_SUBMISSION_FILE_SIZE_BYTES + 1)
      )
    ).toBe('too_large')
  })

  it('resolveSubmissionContentType infers from extension when type empty', () => {
    const f = makeFile('notes.md', '', 1)
    expect(resolveSubmissionContentType(f)).toBe('text/markdown')
  })

  it('resolveSubmissionContentType maps image/jpg to image/jpeg', () => {
    const f = makeFile('pic.jpg', 'image/jpg', 1)
    expect(resolveSubmissionContentType(f)).toBe('image/jpeg')
  })

  it('formatBinarySize formats tiers', () => {
    expect(formatBinarySize(0)).toBe('0 B')
    expect(formatBinarySize(512)).toBe('512 B')
    expect(formatBinarySize(1536)).toBe('1.5 KB')
    expect(formatBinarySize(50 * 1024 * 1024)).toBe('50 MB')
  })

  it('submissionFileFormatLabel uses last extension', () => {
    expect(submissionFileFormatLabel('x.PDF')).toBe('PDF')
    expect(submissionFileFormatLabel('noext')).toBe('—')
  })

  it('submissionFileMetaPlain has no leading bullet', () => {
    expect(submissionFileMetaPlain('a.pdf', 1024)).toMatch(/^PDF/)
    expect(submissionFileMetaPlain('a.pdf', 1024)).toContain('\u2022')
  })

  it('submissionFileMetaSuffix starts with bullet then plain', () => {
    expect(submissionFileMetaSuffix('a.pdf', 1024).startsWith('\u2022 ')).toBe(true)
    expect(submissionFileMetaSuffix('a.pdf', 1024)).toContain('PDF')
  })
})
