import { platformFetchJson } from '@/shared/api/platformClient'
import type { components } from '@/shared/api/identityMe.schema'

export type UpdateMyContactsInput = components['schemas']['v1UpdateMyContactsRequest']
export type UpdateMyContactsResponse = components['schemas']['v1UpdateMyContactsResponse']

export async function updateMyContacts(
  input: UpdateMyContactsInput
): Promise<UpdateMyContactsResponse> {
  return platformFetchJson<UpdateMyContactsResponse>('/v1/users/me/contacts', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}
