import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type Body = operations['HackathonService_UpdateHackathonResultDraft']['requestBody']['content']['application/json']
type Response =
  operations['HackathonService_UpdateHackathonResultDraft']['responses']['200']['content']['application/json']

export async function updateHackathonResultDraft(
  hackathonId: string,
  body: Body
): Promise<Response> {
  return platformFetchJson<Response>(`/v1/hackathons/${hackathonId}/result`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
