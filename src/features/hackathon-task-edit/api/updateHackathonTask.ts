import { platformFetchJson } from '@/shared/api/platformClient'

export type UpdateHackathonTaskRequest = {
  hackathonId: string
  task: string
}

export type ValidationError = {
  code?: string
  field?: string
  message: string
  meta?: Record<string, string>
}

export type UpdateHackathonTaskResponse = {
  validationErrors?: ValidationError[]
}

export async function updateHackathonTask(
  request: UpdateHackathonTaskRequest
): Promise<UpdateHackathonTaskResponse> {
  const { hackathonId, task } = request
  return platformFetchJson<UpdateHackathonTaskResponse>(`/v1/hackathons/${hackathonId}/task`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task }),
  })
}
