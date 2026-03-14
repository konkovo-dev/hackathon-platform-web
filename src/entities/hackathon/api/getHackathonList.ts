import { platformFetchJson } from '@/shared/api/platformClient'
import { normalizeHackathonStage } from '@/entities/hackathon-context/model/types'
import type { HackathonListResponse, HackathonListFilters } from '../model/types'
import { buildQueryFromFilters, getDefaultFilters } from '../model/filterMapper'

const DEFAULT_PAGE_SIZE = 50

export async function getHackathonList(
  filters?: HackathonListFilters,
  pageToken?: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<HackathonListResponse> {
  const query = filters
    ? buildQueryFromFilters(filters, pageToken, pageSize)
    : buildQueryFromFilters(getDefaultFilters(), pageToken, pageSize)

  const response = await platformFetchJson<HackathonListResponse>('/v1/hackathons/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  })

  return {
    ...response,
    hackathons: response.hackathons.map(h => ({
      ...h,
      stage: normalizeHackathonStage(h.stage as any),
    })),
  }
}
