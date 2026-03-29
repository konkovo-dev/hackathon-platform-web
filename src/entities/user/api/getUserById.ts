import { platformFetchJson } from '@/shared/api/platformClient'
import type { components } from '@/shared/api/platform.schema'
import type { PublicProfile, Skill, ContactItem } from '../model/types'
import { normalizeUserAvatarFields } from './normalizeUserAvatar'

type GetUserResponse = components['schemas']['v1GetUserResponse']

function normalizeSkills(raw: GetUserResponse['skills']): Skill[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((s): s is Skill => s != null)
}

function normalizeContacts(raw: GetUserResponse['contacts']): ContactItem[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((c): c is ContactItem => c != null)
}

export async function getUserById(userId: string): Promise<PublicProfile> {
  const json = await platformFetchJson<GetUserResponse>(
    `/v1/users/${userId}?includeSkills=true&includeContacts=true`,
    { method: 'GET' }
  )

  return {
    user: normalizeUserAvatarFields(json.user),
    skills: normalizeSkills(json.skills),
    contacts: normalizeContacts(json.contacts),
  }
}
