import { platformFetchJson } from '@/shared/api/platformClient'

export type PublishHackathonRequest = {
  idempotencyKey: string
}

export type PublishHackathonResponse = {
  ok: boolean
}

export async function publishHackathon(
  hackathonId: string,
  request: PublishHackathonRequest
): Promise<PublishHackathonResponse> {
  return platformFetchJson<PublishHackathonResponse>(
    `/v1/hackathons/${hackathonId}/publish`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}
