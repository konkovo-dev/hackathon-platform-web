import { describe, expect, it } from 'vitest'
import { normalizeAvatarImageSrc, toAvatarImgSrc } from './avatarUrl'

describe('normalizeAvatarImageSrc', () => {
  it('encodes cyrillic filename and space in path', () => {
    const raw =
      'https://api.hackplatform.ru:9000/avatars/4e159fb1-e03c-4003-bd23-8560761f6f85/uuid/Слой 0.png'
    const out = normalizeAvatarImageSrc(raw)
    expect(out).toContain('%D0%A1%D0%BB%D0%BE%D0%B9')
    expect(out).toContain('%200.png')
    expect(out).not.toContain(' ')
  })

  it('preserves NFD (и + combining breve) like MinIO presigned key', () => {
    const raw =
      'https://api.hackplatform.ru:9000/avatars/x/%D0%A1%D0%BB%D0%BE%D0%B8%CC%86%200.png'
    const out = normalizeAvatarImageSrc(raw)
    expect(out).toContain('%D0%B8%CC%86')
    expect(out).not.toContain('%D0%B9%200')
  })

  it('does not break already-encoded segments', () => {
    const encoded = 'https://cdn.example.com/avatars/%D0%A1%D0%BB%D0%BE%D0%B9%200.png'
    const out = normalizeAvatarImageSrc(encoded)
    expect(out).toMatch(/^https:\/\/cdn\.example\.com\/avatars\//)
    expect(out).not.toContain(' ')
  })

  it('returns original string when not a valid URL', () => {
    expect(normalizeAvatarImageSrc('not-a-url')).toBe('not-a-url')
  })
})

describe('toAvatarImgSrc', () => {
  it('wraps default MinIO host with avatar-proxy', () => {
    const u = 'https://api.hackplatform.ru:9000/avatars/bucket/u/%D0%A1.png'
    expect(toAvatarImgSrc(u)).toMatch(/^\/api\/avatar-proxy\?url=/)
  })

  it('does not wrap arbitrary CDN', () => {
    const u = 'https://cdn.example.com/a.jpg'
    expect(toAvatarImgSrc(u)).toBe('https://cdn.example.com/a.jpg')
  })
})
