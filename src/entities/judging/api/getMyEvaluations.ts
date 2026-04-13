import { platformFetchJson } from '@/shared/api/platformClient'
import type { components, operations } from '@/shared/api/platform.schema'

export type EvaluationWithSubmission = components['schemas']['v1EvaluationWithSubmission']
export type Evaluation = components['schemas']['v1Evaluation']
type GetMyEvaluationsBody = components['schemas']['JudgingServiceGetMyEvaluationsBody']
type GetMyEvaluationsResponse =
  operations['JudgingService_GetMyEvaluations']['responses']['200']['content']['application/json']

export async function getMyEvaluations(
  hackathonId: string,
  body: GetMyEvaluationsBody = {}
): Promise<GetMyEvaluationsResponse> {
  return platformFetchJson<GetMyEvaluationsResponse>(
    `/v1/hackathons/${hackathonId}/judging/my-evaluations/list`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
}
