import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type RegisterForHackathonRequest =
  operations['ParticipationService_RegisterForHackathon']['requestBody']['content']['application/json']

export type RegisterForHackathonResponse =
  operations['ParticipationService_RegisterForHackathon']['responses']['200']['content']['application/json']

export async function registerForHackathon(
  hackathonId: string,
  request: RegisterForHackathonRequest = {}
): Promise<RegisterForHackathonResponse> {
  return platformFetchJson<RegisterForHackathonResponse>(
    `/v1/hackathons/${hackathonId}/participations/register`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
