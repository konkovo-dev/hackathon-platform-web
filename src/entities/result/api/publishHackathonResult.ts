import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type Response =
  operations['HackathonService_PublishHackathonResult']['responses']['200']['content']['application/json']

export async function publishHackathonResult(hackathonId: string): Promise<Response> {
  return platformFetchJson<Response>(`/v1/hackathons/${hackathonId}/result/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
}
