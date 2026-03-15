import { platformFetchJson } from '@/shared/api/platformClient'
import { normalizeHackathonStage } from '@/entities/hackathon-context/model/types'
import type { operations } from '@/shared/api/platform.schema'
import type { HackathonListResponse, Hackathon } from '../model/types'

const DEFAULT_PAGE_SIZE = 20

type ListHackathonsRequest =
  operations['HackathonService_ListHackathons']['requestBody']['content']['application/json']

export type RoleFilter = 'owner' | 'organizer' | 'judge' | 'mentor'

export async function getHackathonsByRole(
  role: RoleFilter,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<HackathonListResponse> {
  const query: ListHackathonsRequest = {
    query: {
      filterGroups: [
        {
          filters: [
            {
              field: 'my_role',
              operation: 'FILTER_OPERATION_EQUAL',
              stringValue: role,
            },
          ],
        },
      ],
      sort: [
        {
          field: 'starts_at',
          direction: 'SORT_DIRECTION_DESC',
        },
      ],
      page: {
        pageSize,
      },
    },
    includeDescription: false,
    includeLinks: false,
    includeLimits: true,
  }

  const response = await platformFetchJson<
    operations['HackathonService_ListHackathons']['responses']['200']['content']['application/json']
  >('/v1/hackathons/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  })

  const hackathons = (response.hackathons ?? []).map(hackathon => ({
    ...hackathon,
    stage: normalizeHackathonStage(hackathon.stage as any),
  }))

  return {
    ...response,
    hackathons,
  } as HackathonListResponse
}

export async function getHackathonsByParticipation(
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<HackathonListResponse> {
  const query: ListHackathonsRequest = {
    query: {
      filterGroups: [
        {
          filters: [
            {
              field: 'my_participation',
              operation: 'FILTER_OPERATION_EQUAL',
              boolValue: true,
            },
          ],
        },
      ],
      sort: [
        {
          field: 'starts_at',
          direction: 'SORT_DIRECTION_DESC',
        },
      ],
      page: {
        pageSize,
      },
    },
    includeDescription: false,
    includeLinks: false,
    includeLimits: true,
  }

  const response = await platformFetchJson<
    operations['HackathonService_ListHackathons']['responses']['200']['content']['application/json']
  >('/v1/hackathons/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  })

  const hackathons = (response.hackathons ?? []).map(hackathon => ({
    ...hackathon,
    stage: normalizeHackathonStage(hackathon.stage as any),
  }))

  return {
    ...response,
    hackathons,
  } as HackathonListResponse
}
