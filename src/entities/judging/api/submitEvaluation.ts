import { randomUUID } from '@/shared/lib/randomUuid'
import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type SubmitEvaluationResponse =
  operations['JudgingService_SubmitEvaluation']['responses']['200']['content']['application/json']

export async function submitEvaluation(
  hackathonId: string,
  submissionId: string,
  params: { score: number; comment: string }
): Promise<SubmitEvaluationResponse> {
  return platformFetchJson<SubmitEvaluationResponse>(
    `/v1/hackathons/${hackathonId}/submissions/${submissionId}/evaluate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: params.score,
        comment: params.comment,
        idempotencyKey: { key: randomUUID() },
      }),
    }
  )
}
