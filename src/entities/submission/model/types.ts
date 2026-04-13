import type { components } from '@/shared/api/platform.schema'

export type OwnerKind = 'user' | 'team'
export type FileUploadStatus = 'pending' | 'completed' | 'failed'

type ApiFileUploadStatus = components['schemas']['v1FileUploadStatus']

function mapFileUploadStatus(status: ApiFileUploadStatus | undefined): FileUploadStatus {
  switch (status) {
    case 'FILE_UPLOAD_STATUS_COMPLETED':
      return 'completed'
    case 'FILE_UPLOAD_STATUS_FAILED':
      return 'failed'
    case 'FILE_UPLOAD_STATUS_PENDING':
    case 'FILE_UPLOAD_STATUS_UNSPECIFIED':
    default:
      return 'pending'
  }
}

export type SubmissionFile = {
  fileId: string
  submissionId: string
  filename: string
  sizeBytes: string
  contentType: string
  uploadStatus: FileUploadStatus
  createdAt: string
  completedAt?: string
}

export type Submission = {
  submissionId: string
  hackathonId: string
  ownerKind: OwnerKind
  ownerId: string
  createdByUserId: string
  title: string
  description?: string
  isFinal: boolean
  files: SubmissionFile[]
  createdAt: string
  updatedAt: string
}

function normalizeFile(f: components['schemas']['v1SubmissionFile']): SubmissionFile | null {
  if (!f.fileId || !f.submissionId || !f.filename) return null
  return {
    fileId: f.fileId,
    submissionId: f.submissionId,
    filename: f.filename,
    sizeBytes: f.sizeBytes ?? '0',
    contentType: f.contentType ?? '',
    uploadStatus: mapFileUploadStatus(f.uploadStatus),
    createdAt: f.createdAt ?? '',
    completedAt: f.completedAt,
  }
}

export function normalizeSubmission(s: components['schemas']['v1Submission']): Submission | null {
  if (!s.submissionId || !s.hackathonId || !s.ownerId || !s.ownerKind || !s.createdByUserId) {
    return null
  }
  const ownerKind: OwnerKind = s.ownerKind === 'OWNER_KIND_TEAM' ? 'team' : 'user'
  return {
    submissionId: s.submissionId,
    hackathonId: s.hackathonId,
    ownerKind,
    ownerId: s.ownerId,
    createdByUserId: s.createdByUserId,
    title: s.title ?? '',
    description: s.description,
    isFinal: s.isFinal ?? false,
    files: (s.files ?? []).map(normalizeFile).filter((f): f is SubmissionFile => f !== null),
    createdAt: s.createdAt ?? '',
    updatedAt: s.updatedAt ?? '',
  }
}
