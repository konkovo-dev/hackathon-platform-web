import { describe, expect, it } from 'vitest'
import type { MeUser } from '@/entities/user/model/types'
import { normalizeUserAvatarFields, pickAvatarUrlFromPayload } from './normalizeUserAvatar'

describe('pickAvatarUrlFromPayload', () => {
  it('prefers avatarUrl', () => {
    expect(pickAvatarUrlFromPayload({ avatarUrl: 'https://a.com/x.jpg', avatar_url: 'https://b.com/' })).toBe(
      'https://a.com/x.jpg'
    )
  })

  it('uses avatar_url when avatarUrl missing', () => {
    expect(pickAvatarUrlFromPayload({ avatar_url: 'https://cdn.example.com/u.png' })).toBe(
      'https://cdn.example.com/u.png'
    )
  })

  it('returns undefined for empty strings', () => {
    expect(pickAvatarUrlFromPayload({ avatarUrl: '  ' })).toBeUndefined()
    expect(pickAvatarUrlFromPayload({ avatarUrl: '', avatar_url: '' })).toBeUndefined()
  })
})

describe('normalizeUserAvatarFields', () => {
  it('maps avatar_url onto avatarUrl', () => {
    const raw = { userId: '1', username: 'u', avatar_url: 'https://x.com/a.jpg' } as MeUser & {
      avatar_url: string
    }
    const u = normalizeUserAvatarFields(raw)
    expect(u?.avatarUrl).toBe('https://x.com/a.jpg')
  })
})
