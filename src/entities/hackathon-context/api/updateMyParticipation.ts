import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type UpdateBody =
  operations['ParticipationService_UpdateMyParticipation']['requestBody']['content']['application/json']
type UpdateResponse =
  operations['ParticipationService_UpdateMyParticipation']['responses']['200']['content']['application/json']

/**
 * Обновляет профиль участия (мотивация, желаемые роли в команде).
 */
export async function updateMyParticipation(
  hackathonId: string,
  body: UpdateBody
): Promise<UpdateResponse> {
  return platformFetchJson<UpdateResponse>(`/v1/hackathons/${hackathonId}/participations/me`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}
