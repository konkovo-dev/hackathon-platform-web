import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type GetHackathonTaskResponse =
  operations['HackathonService_GetHackathonTask']['responses']['200']['content']['application/json']

export async function getHackathonTask(
  hackathonId: string
): Promise<string | undefined> {
  const path = `/v1/hackathons/${hackathonId}/task`
  const response = await platformFetchJson<GetHackathonTaskResponse>(path, {
    method: 'GET',
  })
  return response.task
}
