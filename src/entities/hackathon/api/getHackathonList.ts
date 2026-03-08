import { platformFetchJson } from '@/shared/api/platformClient'
import type { HackathonListResponse } from '../model/types'

export async function getHackathonList(): Promise<HackathonListResponse> {
  return platformFetchJson('/v1/hackathons/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      includeDescription: false,
      includeLinks: false,
      includeLimits: true,
    }),
  })
}
