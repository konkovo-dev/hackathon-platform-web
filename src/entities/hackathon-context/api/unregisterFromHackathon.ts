import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type UnregisterBody =
  operations['ParticipationService_UnregisterFromHackathon']['requestBody']['content']['application/json']
type UnregisterResponse =
  operations['ParticipationService_UnregisterFromHackathon']['responses']['200']['content']['application/json']

/**
 * Unregisters the authenticated user from the hackathon (soft-deletes participation).
 */
export async function unregisterFromHackathon(
  hackathonId: string,
  request: UnregisterBody = {}
): Promise<UnregisterResponse> {
  return platformFetchJson<UnregisterResponse>(
    `/v1/hackathons/${hackathonId}/participations/me/unregister`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
