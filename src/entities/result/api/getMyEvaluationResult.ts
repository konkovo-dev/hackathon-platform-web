import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type Response =
  operations['JudgingService_GetMyEvaluationResult']['responses']['200']['content']['application/json']

export async function getMyEvaluationResult(hackathonId: string): Promise<Response> {
  return platformFetchJson<Response>(`/v1/hackathons/${hackathonId}/judging/my-result`, {
    method: 'GET',
  })
}
