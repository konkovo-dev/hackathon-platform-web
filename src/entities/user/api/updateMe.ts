import { platformFetchJson } from '@/shared/api/platformClient'
import type { components } from '@/shared/api/identityMe.schema'

export type UpdateMeInput = components['schemas']['v1UpdateMeRequest']
export type UpdateMeResponse = components['schemas']['v1UpdateMeResponse']

export async function updateMe(input: UpdateMeInput): Promise<UpdateMeResponse> {
  const response = await platformFetchJson<UpdateMeResponse>('/v1/users/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return response
}
