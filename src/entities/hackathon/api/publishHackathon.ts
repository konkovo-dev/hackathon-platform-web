import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

export type PublishHackathonRequest =
  operations['HackathonService_PublishHackathon']['requestBody']['content']['application/json']

export type PublishHackathonResponse =
  operations['HackathonService_PublishHackathon']['responses']['200']['content']['application/json']

export async function publishHackathon(
  hackathonId: string,
  request: PublishHackathonRequest
): Promise<PublishHackathonResponse> {
  return platformFetchJson<PublishHackathonResponse>(
    `/v1/hackathons/${hackathonId}/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  )
}
