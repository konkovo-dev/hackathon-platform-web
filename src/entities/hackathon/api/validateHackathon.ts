import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations, components } from '@/shared/api/platform.schema'

export type ValidationError = components['schemas']['v1ValidationError']

export type ValidateHackathonResponse =
  operations['HackathonService_ValidateHackathon']['responses']['200']['content']['application/json']

export async function validateHackathon(
  hackathonId: string
): Promise<ValidateHackathonResponse> {
  return platformFetchJson<ValidateHackathonResponse>(
    `/v1/hackathons/${hackathonId}/validate`,
    {
      method: 'GET',
    }
  )
}
