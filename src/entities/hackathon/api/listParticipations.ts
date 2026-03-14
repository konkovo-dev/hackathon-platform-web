import { platformFetchJson } from '@/shared/api/platformClient'

export type ParticipationStatus =
  | 'PARTICIPATION_STATUS_UNSPECIFIED'
  | 'LOOKING_FOR_TEAM'
  | 'SINGLE'
  | 'TEAM'

export type ParticipationStatusFilter = {
  statuses?: ParticipationStatus[]
}

export type HackathonParticipation = {
  hackathonId: string
  userId: string
  status: ParticipationStatus
  teamId?: string | null
  profile?: {
    motivationText?: string
    wishedRoles?: Array<{ id: string; name: string }>
  }
  registeredAt?: string
  updatedAt?: string
}

export type ListParticipationsRequest = {
  query?: {
    page?: {
      pageSize?: number
      pageToken?: string
    }
  }
  statusFilter?: ParticipationStatusFilter
  wishedRoleIdsFilter?: string[]
}

export type ListParticipationsResponse = {
  participations: HackathonParticipation[]
  page?: {
    hasMore: boolean
    nextPageToken: string
  }
}

export async function listParticipations(
  hackathonId: string,
  request: ListParticipationsRequest = {}
): Promise<ListParticipationsResponse> {
  return platformFetchJson<ListParticipationsResponse>(
    `/v1/hackathons/${hackathonId}/participations/list`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
