'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSubmission,
  listSubmissions,
  getSubmission,
  updateSubmission,
  selectFinalSubmission,
  getFinalSubmission,
  createSubmissionUpload,
  completeSubmissionUpload,
  getSubmissionFileDownloadUrl,
} from '../api/submissionApi'
import { resolveSubmissionContentType } from '@/shared/lib/file'
import { normalizeSubmission, type Submission, type OwnerKind } from './types'

export function mySubmissionsQueryKey(hackathonId: string) {
  return ['hackathon', hackathonId, 'submissions', 'me'] as const
}

export function finalSubmissionQueryKey(hackathonId: string, ownerKind: OwnerKind, ownerId: string) {
  return ['hackathon', hackathonId, 'final-submission', ownerKind, ownerId] as const
}

export function submissionDetailQueryKey(hackathonId: string, submissionId: string) {
  return ['hackathon', hackathonId, 'submission', submissionId] as const
}

export function useMySubmissionsQuery(hackathonId: string | null | undefined) {
  return useQuery({
    queryKey: hackathonId ? mySubmissionsQueryKey(hackathonId) : ['hackathon', 'submissions', 'disabled'],
    queryFn: async () => {
      if (!hackathonId) return []
      const res = await listSubmissions(hackathonId, {})
      const raw = res.submissions ?? []
      return raw.map(normalizeSubmission).filter((s): s is Submission => s !== null)
    },
    enabled: Boolean(hackathonId),
    staleTime: 15_000,
  })
}

export function useFinalSubmissionQuery(
  hackathonId: string | null | undefined,
  ownerKind: OwnerKind | null | undefined,
  ownerId: string | null | undefined
) {
  return useQuery({
    queryKey:
      hackathonId && ownerKind && ownerId
        ? finalSubmissionQueryKey(hackathonId, ownerKind, ownerId)
        : ['hackathon', 'final-submission', 'disabled'],
    queryFn: async () => {
      if (!hackathonId || !ownerKind || !ownerId) return null
      try {
        const res = await getFinalSubmission(hackathonId, ownerKind, ownerId)
        return res.submission ? normalizeSubmission(res.submission) : null
      } catch {
        return null
      }
    },
    enabled: Boolean(hackathonId && ownerKind && ownerId),
    staleTime: 15_000,
    retry: false,
  })
}

export function useSubmissionDetailQuery(
  hackathonId: string | null | undefined,
  submissionId: string | null | undefined,
  enabled: boolean
) {
  return useQuery({
    queryKey:
      hackathonId && submissionId
        ? submissionDetailQueryKey(hackathonId, submissionId)
        : ['hackathon', 'submission-detail', 'disabled'],
    queryFn: async () => {
      if (!hackathonId || !submissionId) return null
      const res = await getSubmission(hackathonId, submissionId)
      const raw = res.submission
      return raw ? normalizeSubmission(raw) : null
    },
    enabled: Boolean(hackathonId && submissionId && enabled),
    staleTime: 15_000,
  })
}

export function useCreateSubmissionMutation(hackathonId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ title, description }: { title: string; description?: string }) =>
      createSubmission(hackathonId, { title, description }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'submissions'] })
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'final-submission'] })
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'submission'] })
    },
  })
}

export function useUpdateSubmissionMutation(hackathonId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      submissionId,
      description,
    }: {
      submissionId: string
      description?: string
    }) => updateSubmission(hackathonId, submissionId, { description }),
    onSuccess: (_, { submissionId }) => {
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'submissions'] })
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'final-submission'] })
      qc.invalidateQueries({
        queryKey: submissionDetailQueryKey(hackathonId, submissionId),
      })
    },
  })
}

export function useSelectFinalSubmissionMutation(hackathonId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (submissionId: string) => selectFinalSubmission(hackathonId, submissionId),
    onSuccess: (_, submissionId) => {
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'submissions'] })
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'final-submission'] })
      qc.invalidateQueries({
        queryKey: submissionDetailQueryKey(hackathonId, submissionId),
      })
    },
  })
}

export function useUploadSubmissionFileMutation(hackathonId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ submissionId, file }: { submissionId: string; file: File }) => {
      const contentType = resolveSubmissionContentType(file)
      if (!contentType) {
        throw new Error('Submission file upload: unsupported file type')
      }
      const created = await createSubmissionUpload(hackathonId, submissionId, {
        filename: file.name,
        contentType,
        sizeBytes: String(file.size),
      })
      const uploadUrl = created.uploadUrl
      const fileId = created.fileId
      if (!uploadUrl || !fileId) {
        throw new Error('Submission file upload: missing uploadUrl or fileId')
      }

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': contentType },
      })
      if (!putRes.ok) {
        throw new Error(`Submission file upload to storage failed: ${putRes.status}`)
      }

      return completeSubmissionUpload(hackathonId, submissionId, fileId)
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'submissions'] })
      qc.invalidateQueries({ queryKey: ['hackathon', hackathonId, 'final-submission'] })
      qc.invalidateQueries({
        queryKey: submissionDetailQueryKey(hackathonId, variables.submissionId),
      })
    },
  })
}

export function useSubmissionFileDownloadUrlMutation(hackathonId: string) {
  return useMutation({
    mutationFn: ({
      submissionId,
      fileId,
    }: {
      submissionId: string
      fileId: string
    }) => getSubmissionFileDownloadUrl(hackathonId, submissionId, fileId),
  })
}
