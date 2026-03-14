import { platformFetchJson } from '@/shared/api/platformClient'

export type PublishHackathonRequest = {
  idempotencyKey?: {
    key: string
  }
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  )
}
