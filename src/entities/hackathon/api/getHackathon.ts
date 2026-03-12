import { platformFetchJson } from '@/shared/api/platformClient'
import type { Hackathon } from '../model/types'

export interface GetHackathonOptions {
  includeDescription?: boolean
  includeLinks?: boolean
  includeLimits?: boolean
  includeTask?: boolean
  includeResult?: boolean
}

interface GetHackathonResponse {
  hackathon: Hackathon
}

export async function getHackathon(
  hackathonId: string,
  options?: GetHackathonOptions
): Promise<Hackathon> {
  const params = new URLSearchParams()

  if (options?.includeDescription) params.set('includeDescription', 'true')
  if (options?.includeLinks) params.set('includeLinks', 'true')
  if (options?.includeLimits) params.set('includeLimits', 'true')
  if (options?.includeTask) params.set('includeTask', 'true')
  if (options?.includeResult) params.set('includeResult', 'true')

  const queryString = params.toString()
  const path = `/v1/hackathons/${hackathonId}${queryString ? `?${queryString}` : ''}`

  const response = await platformFetchJson<GetHackathonResponse>(path, {
    method: 'GET',
  })

  return response.hackathon
}
