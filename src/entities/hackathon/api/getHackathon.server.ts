import 'server-only'

import { platformFetchJsonServer } from '@/shared/api/platformClient.server'
import { normalizeHackathonStage } from '@/entities/hackathon-context/model/types'
import type { operations } from '@/shared/api/platform.schema'
import type { Hackathon } from '../model/types'

export type GetHackathonOptions =
  operations['HackathonService_GetHackathon']['parameters']['query']

type GetHackathonResponse =
  operations['HackathonService_GetHackathon']['responses']['200']['content']['application/json']

/**
 * Server-side version of getHackathon - делает прямой запрос к backend
 */
export async function getHackathonServer(
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

  const response = await platformFetchJsonServer<GetHackathonResponse>(path, {
    method: 'GET',
  })

  if (!response.hackathon) {
    throw new Error('Hackathon not found in response')
  }

  return {
    ...response.hackathon,
    stage: normalizeHackathonStage(response.hackathon.stage as any),
  }
}
