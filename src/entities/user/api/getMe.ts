import { platformFetchJson } from '@/shared/api/platformClient'
import type { components } from '@/shared/api/identityMe.schema'
import type { MeProfile, Skill, ContactWithVisibility, Visibility } from '../model/types'
import { normalizeUserAvatarFields } from './normalizeUserAvatar'

type GetMeResponse = components['schemas']['v1GetMeResponse']

function normalizeSkills(raw: GetMeResponse['skills']): Skill[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((s): s is Skill => s != null)
}

function normalizeContacts(raw: GetMeResponse['contacts']): ContactWithVisibility[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((c): c is ContactWithVisibility => c?.contact != null)
}

function normalizeVisibility(raw: GetMeResponse['visibility']): Visibility {
  return {
    skills: raw?.skills ?? 'VISIBILITY_LEVEL_PUBLIC',
    contacts: raw?.contacts ?? 'VISIBILITY_LEVEL_PUBLIC',
  }
}

export async function getMe(): Promise<MeProfile> {
  const json = await platformFetchJson<GetMeResponse>('/v1/users/me', { method: 'GET' })

  return {
    user: normalizeUserAvatarFields(json.user),
    skills: normalizeSkills(json.skills),
    contacts: normalizeContacts(json.contacts),
    visibility: normalizeVisibility(json.visibility),
  }
}

export function getUserDisplayName(
  me: Pick<MeProfile, 'user'> | null | undefined,
  fallbackUserId?: string
): string {
  const user = me?.user
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim()
  return fullName || user?.username || user?.userId || fallbackUserId || '—'
}
