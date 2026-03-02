import { platformFetchJson } from '@/shared/api/platformClient'
import type { components } from '@/shared/api/identityMe.schema'

export type UpdateMySkillsInput = components['schemas']['v1UpdateMySkillsRequest']
export type UpdateMySkillsResponse = components['schemas']['v1UpdateMySkillsResponse']

export async function updateMySkills(input: UpdateMySkillsInput): Promise<UpdateMySkillsResponse> {
  return platformFetchJson<UpdateMySkillsResponse>('/v1/users/me/skills', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}
