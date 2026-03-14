import { platformFetchJson } from '@/shared/api/platformClient'

export type HackathonRole = 
  | 'HACKATHON_ROLE_UNSPECIFIED'
  | 'HACKATHON_ROLE_OWNER' 
  | 'HACKATHON_ROLE_ORGANIZER'
  | 'HACKATHON_ROLE_MENTOR'
  | 'HACKATHON_ROLE_JURY'
  | 'HX_ROLE_OWNER'
  | 'HX_ROLE_ORGANIZER'
  | 'HX_ROLE_MENTOR'
  | 'HX_ROLE_JUDGE'
  | 'HX_ROLE_JURY'

export type HackathonStaffMember = {
  userId: string
  roles: HackathonRole[]
}

export type ListHackathonStaffResponse = {
  staff: HackathonStaffMember[]
  page?: {
    hasMore: boolean
    nextPageToken: string
  }
}

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
