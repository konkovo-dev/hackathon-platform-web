import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type Response =
  operations['HackathonService_GetHackathonResult']['responses']['200']['content']['application/json']

export async function getHackathonResult(hackathonId: string): Promise<Response> {
  return platformFetchJson<Response>(`/v1/hackathons/${hackathonId}/result`, {
    method: 'GET',
  })
}
