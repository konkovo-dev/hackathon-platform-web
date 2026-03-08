import { platformFetchJson } from '@/shared/api/platformClient'
import type { HackathonContext } from '../model/types'

export async function getHackathonContext(hackathonId: string): Promise<HackathonContext> {
  return platformFetchJson<HackathonContext>(`/hackathons/${hackathonId}/context`, {
    method: 'GET',
  })
}
