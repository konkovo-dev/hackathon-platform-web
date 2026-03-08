import { platformFetchJson } from '@/shared/api/platformClient'
import type { HackathonListResponse, HackathonListFilters } from '../model/types'
import { buildQueryFromFilters, getDefaultFilters } from '../model/filterMapper'

const DEFAULT_PAGE_SIZE = 50

export async function getHackathonList(
  filters?: HackathonListFilters,
  pageToken?: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<HackathonListResponse> {
  const query = filters ? buildQueryFromFilters(filters, pageToken, pageSize) : buildQueryFromFilters(getDefaultFilters(), pageToken, pageSize)

  return platformFetchJson('/v1/hackathons/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  })
}
