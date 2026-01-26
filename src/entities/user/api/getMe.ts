import { platformFetchJson } from '@/shared/api/platformClient'

type UnknownUser = Record<string, unknown>

export type MeUser = {
  userId?: string
  firstName?: string
  lastName?: string
  username?: string
}

export type GetMeResponse = {
  user?: MeUser
}

function readString(obj: UnknownUser, key: string): string | undefined {
  const v = obj[key]
  return typeof v === 'string' && v.trim() ? v : undefined
}

function normalizeUser(raw: unknown): MeUser | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const u = raw as UnknownUser

  const firstName = readString(u, 'firstName') ?? readString(u, 'first_name')
  const lastName = readString(u, 'lastName') ?? readString(u, 'last_name')
  const username = readString(u, 'username')
  const userId = readString(u, 'userId') ?? readString(u, 'user_id')

  return { userId, firstName, lastName, username }
}

export async function getMe(): Promise<GetMeResponse> {
  const json = await platformFetchJson<Record<string, unknown>>('/v1/users/me', { method: 'GET' })
  const user = normalizeUser(json.user)
  return { user }
}

export function getUserDisplayName(me: GetMeResponse | null | undefined, fallbackUserId?: string): string {
  const user = me?.user
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
  return fullName || user?.username || user?.userId || fallbackUserId || '—'
}
