import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'
import type { HackathonRole } from './listHackathonStaff'

export type RemoveHackathonRoleRequest =
  operations['StaffService_RemoveHackathonRole']['requestBody']['content']['application/json']

export type RemoveHackathonRoleResponse =
  operations['StaffService_RemoveHackathonRole']['responses']['200']['content']['application/json']

export async function removeHackathonRole(
  hackathonId: string,
  request: RemoveHackathonRoleRequest
): Promise<RemoveHackathonRoleResponse> {
  return platformFetchJson<RemoveHackathonRoleResponse>(
    `/v1/hackathons/${hackathonId}/staff/removeRole`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}

export type { HackathonRole }
