import { randomUUID } from '@/shared/lib/randomUuid'
import { platformFetchJson } from '@/shared/api/platformClient'
import type { operations } from '@/shared/api/platform.schema'

type AssignSubmissionsToJudgesResponse =
  operations['JudgingService_AssignSubmissionsToJudges']['responses']['200']['content']['application/json']

export async function assignSubmissionsToJudges(
  hackathonId: string
): Promise<AssignSubmissionsToJudgesResponse> {
  return platformFetchJson<AssignSubmissionsToJudgesResponse>(
    `/v1/hackathons/${hackathonId}/judging/assign`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idempotencyKey: { key: randomUUID() } }),
    }
  )
}
