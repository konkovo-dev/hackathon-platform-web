import { platformFetchJson } from '@/shared/api/platformClient'
import type { components } from '@/shared/api/platform.schema'

type CreateAvatarUploadRequest = components['schemas']['v1CreateAvatarUploadRequest']
type CreateAvatarUploadResponse = components['schemas']['v1CreateAvatarUploadResponse']
type CompleteAvatarUploadRequest = components['schemas']['v1CompleteAvatarUploadRequest']
type CompleteAvatarUploadResponse = components['schemas']['v1CompleteAvatarUploadResponse']

export async function createAvatarUpload(
  input: CreateAvatarUploadRequest
): Promise<CreateAvatarUploadResponse> {
  return platformFetchJson<CreateAvatarUploadResponse>('/v1/users/me/avatar/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export async function completeAvatarUpload(
  input: CompleteAvatarUploadRequest
): Promise<CompleteAvatarUploadResponse> {
  return platformFetchJson<CompleteAvatarUploadResponse>('/v1/users/me/avatar/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}
