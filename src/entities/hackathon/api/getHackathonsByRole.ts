import { platformFetchJson } from '@/shared/api/platformClient'
import { normalizeHackathonStage } from '@/entities/hackathon-context/model/types'
import type { operations } from '@/shared/api/platform.schema'
import type { FilterGroup, HackathonListResponse, Hackathon } from '../model/types'
import { serializeListHackathonsRequestBody } from './serializeListHackathonsRequestBody'

const DEFAULT_PAGE_SIZE = 20

type ListHackathonsRequest =
  operations['HackathonService_ListHackathons']['requestBody']['content']['application/json']

export type RoleFilter = 'owner' | 'organizer' | 'judge' | 'mentor'

export type GetHackathonsByRoleOptions = {
  includeOwnerDrafts?: boolean
}

function mapHackathonStages(response: HackathonListResponse): HackathonListResponse {
  return {
    ...response,
    hackathons: (response.hackathons ?? []).map(hackathon => ({
      ...hackathon,
      stage: normalizeHackathonStage(hackathon.stage as any),
    })),
  } as HackathonListResponse
}

async function postListHackathons(query: ListHackathonsRequest): Promise<HackathonListResponse> {
  const response = await platformFetchJson<
    operations['HackathonService_ListHackathons']['responses']['200']['content']['application/json']
  >('/v1/hackathons/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: serializeListHackathonsRequestBody(query),
  })
  return mapHackathonStages(response as HackathonListResponse)
}

/**
 * Два OR-группы в одном запросе (owner + draft ∨ owner + published) на части стеков
 * дают лишнюю выдачу без ограничения по роли — два запроса с одной AND-группой и merge.
 */
function mergeOwnerPublishedAndDraftResponses(
  published: HackathonListResponse,
  drafts: HackathonListResponse
): HackathonListResponse {
  const byId = new Map<string, Hackathon>()
  for (const h of (published.hackathons ?? []) as Hackathon[]) {
    if (h.hackathonId) byId.set(h.hackathonId, h)
  }
  for (const h of (drafts.hackathons ?? []) as Hackathon[]) {
    if (h.hackathonId) byId.set(h.hackathonId, h)
  }
  const merged = Array.from(byId.values()).sort((a, b) => {
    const ta = a.dates?.startsAt ? new Date(a.dates.startsAt).getTime() : 0
    const tb = b.dates?.startsAt ? new Date(b.dates.startsAt).getTime() : 0
    return tb - ta
  })
  return {
    ...published,
    hackathons: merged,
    page: {
      nextPageToken: '',
      hasMore: Boolean(published.page?.hasMore || drafts.page?.hasMore),
    },
  } as HackathonListResponse
}

export async function getHackathonsByRole(
  role: RoleFilter,
  pageSize: number = DEFAULT_PAGE_SIZE,
  options?: GetHackathonsByRoleOptions
): Promise<HackathonListResponse> {
  const myRoleFilter = {
    field: 'my_role',
    operation: 'FILTER_OPERATION_EQUAL' as const,
    stringValue: role,
  }
  const stateDraftFilter = {
    field: 'state',
    operation: 'FILTER_OPERATION_EQUAL' as const,
    stringValue: 'HACKATHON_STATE_DRAFT',
  }
  const statePublishedFilter = {
    field: 'state',
    operation: 'FILTER_OPERATION_EQUAL' as const,
    stringValue: 'HACKATHON_STATE_PUBLISHED',
  }
  const includeOwnerDrafts = role === 'owner' && Boolean(options?.includeOwnerDrafts)

  const buildListRequest = (filterGroups: FilterGroup[]): ListHackathonsRequest => ({
    query: {
      filterGroups,
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
  })

  if (includeOwnerDrafts) {
    const [published, drafts] = await Promise.all([
      postListHackathons(buildListRequest([{ filters: [myRoleFilter, statePublishedFilter] }])),
      postListHackathons(buildListRequest([{ filters: [myRoleFilter, stateDraftFilter] }])),
    ])
    return mergeOwnerPublishedAndDraftResponses(published, drafts)
  }

  return postListHackathons(buildListRequest([{ filters: [myRoleFilter, statePublishedFilter] }]))
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
    body: serializeListHackathonsRequestBody(query),
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
