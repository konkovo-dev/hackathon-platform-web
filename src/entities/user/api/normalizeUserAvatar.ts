import type { MeUser } from '../model/types'

type AvatarUrlPayload = { avatarUrl?: string; avatar_url?: string }

export function pickAvatarUrlFromPayload(data: AvatarUrlPayload | undefined | null): string | undefined {
  if (!data) return undefined
  const u = data.avatarUrl ?? data.avatar_url
  if (typeof u !== 'string') return undefined
  const t = u.trim()
  return t === '' ? undefined : t
}

export function normalizeUserAvatarFields(raw: MeUser | undefined | null): MeUser | undefined {
  if (!raw) return undefined
  const snake = raw as MeUser & { avatar_url?: string }
  const avatarUrl = pickAvatarUrlFromPayload({ avatarUrl: raw.avatarUrl, avatar_url: snake.avatar_url })
  return { ...raw, avatarUrl }
}
