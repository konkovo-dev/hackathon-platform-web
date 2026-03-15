import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations, components } from '@/shared/api/platform.schema'

export type HackathonRole = components['schemas']['v1HackathonRole']

export type HackathonStaffMember = components['schemas']['v1HackathonStaffMember']

export type ListHackathonStaffResponse =
  operations['StaffService_ListHackathonStaff']['responses']['200']['content']['application/json']

export async function listHackathonStaff(
  hackathonId: string
): Promise<ListHackathonStaffResponse> {
  return platformFetchJson<ListHackathonStaffResponse>(
    `/v1/hackathons/${hackathonId}/staff`,
    {
      method: 'GET',
    }
  )
}
