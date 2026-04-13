import { platformFetchJson } from '@/shared/api/platformClient'
import type { components, operations } from '@/shared/api/platform.schema'

type CreateSubmissionBody = components['schemas']['SubmissionServiceCreateSubmissionBody']
type CreateSubmissionResponse =
  operations['SubmissionService_CreateSubmission']['responses']['200']['content']['application/json']

type ListSubmissionsBody = components['schemas']['SubmissionServiceListSubmissionsBody']
type ListSubmissionsResponse =
  operations['SubmissionService_ListSubmissions']['responses']['200']['content']['application/json']

type GetSubmissionResponse =
  operations['SubmissionService_GetSubmission']['responses']['200']['content']['application/json']

type UpdateSubmissionBody = components['schemas']['SubmissionServiceUpdateSubmissionBody']
type UpdateSubmissionResponse =
  operations['SubmissionService_UpdateSubmission']['responses']['200']['content']['application/json']

type SelectFinalBody = components['schemas']['SubmissionServiceSelectFinalSubmissionBody']
type SelectFinalResponse =
  operations['SubmissionService_SelectFinalSubmission']['responses']['200']['content']['application/json']

type GetFinalSubmissionResponse =
  operations['SubmissionService_GetFinalSubmission']['responses']['200']['content']['application/json']

type CreateUploadBody = components['schemas']['SubmissionFilesServiceCreateSubmissionUploadBody']
type CreateUploadResponse =
  operations['SubmissionFilesService_CreateSubmissionUpload']['responses']['200']['content']['application/json']

type CompleteUploadBody =
  components['schemas']['SubmissionFilesServiceCompleteSubmissionUploadBody']
type CompleteUploadResponse =
  operations['SubmissionFilesService_CompleteSubmissionUpload']['responses']['200']['content']['application/json']

type GetDownloadUrlResponse =
  operations['SubmissionFilesService_GetSubmissionFileDownloadURL']['responses']['200']['content']['application/json']

export async function createSubmission(
  hackathonId: string,
  input: CreateSubmissionBody
): Promise<CreateSubmissionResponse> {
  return platformFetchJson<CreateSubmissionResponse>(`/v1/hackathons/${hackathonId}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, idempotencyKey: { key: crypto.randomUUID() } }),
  })
}

export async function listSubmissions(
  hackathonId: string,
  input: ListSubmissionsBody = {}
): Promise<ListSubmissionsResponse> {
  return platformFetchJson<ListSubmissionsResponse>(
    `/v1/hackathons/${hackathonId}/submissions/list`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  )
}

export async function getSubmission(
  hackathonId: string,
  submissionId: string
): Promise<GetSubmissionResponse> {
  return platformFetchJson<GetSubmissionResponse>(
    `/v1/hackathons/${hackathonId}/submissions/${submissionId}`,
    { method: 'GET' }
  )
}

export async function updateSubmission(
  hackathonId: string,
  submissionId: string,
  input: UpdateSubmissionBody
): Promise<UpdateSubmissionResponse> {
  return platformFetchJson<UpdateSubmissionResponse>(
    `/v1/hackathons/${hackathonId}/submissions/${submissionId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, idempotencyKey: { key: crypto.randomUUID() } }),
    }
  )
}

export async function selectFinalSubmission(
  hackathonId: string,
  submissionId: string
): Promise<SelectFinalResponse> {
  const body: SelectFinalBody = { idempotencyKey: { key: crypto.randomUUID() } }
  return platformFetchJson<SelectFinalResponse>(
    `/v1/hackathons/${hackathonId}/submissions/${submissionId}/select-final`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
}

export async function getFinalSubmission(
  hackathonId: string,
  ownerKind: 'user' | 'team',
  ownerId: string
): Promise<GetFinalSubmissionResponse> {
  return platformFetchJson<GetFinalSubmissionResponse>(
    `/v1/hackathons/${hackathonId}/participants/${ownerKind}/${ownerId}/final-submission`,
    { method: 'GET' }
  )
}

export async function createSubmissionUpload(
  hackathonId: string,
  submissionId: string,
  input: CreateUploadBody
): Promise<CreateUploadResponse> {
  return platformFetchJson<CreateUploadResponse>(
    `/v1/hackathons/${hackathonId}/submissions/${submissionId}/files`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, idempotencyKey: { key: crypto.randomUUID() } }),
    }
  )
}

export async function completeSubmissionUpload(
  hackathonId: string,
  submissionId: string,
  fileId: string
): Promise<CompleteUploadResponse> {
  const body: CompleteUploadBody = { idempotencyKey: { key: crypto.randomUUID() } }
  return platformFetchJson<CompleteUploadResponse>(
    `/v1/hackathons/${hackathonId}/submissions/${submissionId}/files/${fileId}/complete`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
}

export async function getSubmissionFileDownloadUrl(
  hackathonId: string,
  submissionId: string,
  fileId: string
): Promise<GetDownloadUrlResponse> {
  return platformFetchJson<GetDownloadUrlResponse>(
    `/v1/hackathons/${hackathonId}/submissions/${submissionId}/files/${fileId}/download-url`,
    { method: 'GET' }
  )
}
