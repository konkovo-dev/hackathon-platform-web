import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations, components } from '@/shared/api/platform.schema'

export type ParticipationStatus = components['schemas']['v1ParticipationStatus']

export type ParticipationStatusFilter = components['schemas']['v1ParticipationStatusFilter']

export type HackathonParticipation = components['schemas']['v1HackathonParticipation']

export type ListParticipationsRequest =
  operations['ParticipationService_ListHackathonParticipants']['requestBody']['content']['application/json']

export type ListParticipationsResponse =
  operations['ParticipationService_ListHackathonParticipants']['responses']['200']['content']['application/json']

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
