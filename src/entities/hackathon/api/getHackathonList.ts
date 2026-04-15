import { platformFetchJson } from '@/shared/api/platformClient'
import { normalizeHackathonStage } from '@/entities/hackathon-context/model/types'
import type { operations } from '@/shared/api/platform.schema'
import type { HackathonListResponse, HackathonListFilters } from '../model/types'
import { buildQueryFromFilters, getDefaultFilters, hackathonStageMatchesListFilter } from '../model/filterMapper'
import { serializeListHackathonsRequestBody } from './serializeListHackathonsRequestBody'

const DEFAULT_PAGE_SIZE = 50

type ListHackathonsRequest =
  operations['HackathonService_ListHackathons']['requestBody']['content']['application/json']

export async function getHackathonList(
  filters?: HackathonListFilters,
  pageToken?: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<HackathonListResponse> {
  const listFilters = filters ?? getDefaultFilters()
  const query: ListHackathonsRequest = buildQueryFromFilters(listFilters, pageToken, pageSize)

  const response = await platformFetchJson<
    operations['HackathonService_ListHackathons']['responses']['200']['content']['application/json']
  >('/v1/hackathons/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: serializeListHackathonsRequestBody(query),
  })

  const mapped = (response.hackathons ?? []).map(hackathon => ({
    ...hackathon,
    stage: normalizeHackathonStage(hackathon.stage as any),
  }))

  const hackathons =
    listFilters.skipStageFilter
      ? mapped
      : mapped.filter(h => hackathonStageMatchesListFilter(h.stage, listFilters.stage))

  return {
    ...response,
    hackathons,
  } as HackathonListResponse
}
