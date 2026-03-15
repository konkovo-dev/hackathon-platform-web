import { platformFetchJson } from '@/shared/api/platformClient'
import { normalizeHackathonStage } from '@/entities/hackathon-context/model/types'
import type { operations } from '@/shared/api/platform.schema'
import type { HackathonListResponse, HackathonListFilters, Hackathon } from '../model/types'
import { buildQueryFromFilters, getDefaultFilters } from '../model/filterMapper'

const DEFAULT_PAGE_SIZE = 50

type ListHackathonsRequest =
  operations['HackathonService_ListHackathons']['requestBody']['content']['application/json']

export async function getHackathonList(
  filters?: HackathonListFilters,
  pageToken?: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<HackathonListResponse> {
  const query: ListHackathonsRequest = filters
    ? buildQueryFromFilters(filters, pageToken, pageSize)
    : buildQueryFromFilters(getDefaultFilters(), pageToken, pageSize)

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
