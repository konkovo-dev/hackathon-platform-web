import { platformFetchJson } from '@/shared/api/platformClient'
import type { components, operations } from '@/shared/api/platform.schema'

export type AssignmentWithSubmission = components['schemas']['v1AssignmentWithSubmission']
export type GetMyAssignmentsBody = components['schemas']['JudgingServiceGetMyAssignmentsBody']
type GetMyAssignmentsResponse =
  operations['JudgingService_GetMyAssignments']['responses']['200']['content']['application/json']

export async function getMyAssignments(
  hackathonId: string,
  body: GetMyAssignmentsBody = {}
): Promise<GetMyAssignmentsResponse> {
  return platformFetchJson<GetMyAssignmentsResponse>(
    `/v1/hackathons/${hackathonId}/judging/my-assignments/list`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
}
