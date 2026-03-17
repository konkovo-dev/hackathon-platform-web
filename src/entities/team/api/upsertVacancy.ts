import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type UpsertVacancyRequest =
  operations['TeamMembersService_UpsertVacancy']['requestBody']['content']['application/json']

export type UpsertVacancyResponse =
  operations['TeamMembersService_UpsertVacancy']['responses']['200']['content']['application/json']

export async function upsertVacancy(
  hackathonId: string,
  teamId: string,
  request: UpsertVacancyRequest
): Promise<UpsertVacancyResponse> {
  return platformFetchJson<UpsertVacancyResponse>(
    `/v1/hackathons/${hackathonId}/teams/${teamId}/vacancies/upsert`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
