'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import {
  useUploadSubmissionFileMutation,
  type SubmissionFile,
} from '@/entities/submission'
import {
  SUBMISSION_FILE_ACCEPT,
  submissionFileMetaPlain,
  submissionFileMetaSuffix,
  validateSubmissionFile,
  type FileValidationError,
} from '@/shared/lib/file'
import { SubmissionFileListItemRow } from './SubmissionFileListItemRow'

function uploadRowDedupeKey(filename: string, sizeBytes: string | number): string {
  const n = typeof sizeBytes === 'number' ? sizeBytes : Number(sizeBytes)
  return `${filename}\u0000${Number.isFinite(n) ? String(n) : String(sizeBytes)}`
}

type FileState = {
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  validationError?: FileValidationError
}

export interface SubmissionFileUploadProps {
  hackathonId: string
  submissionId: string
  onAllUploaded?: () => void
  /**
   * `edit` — статусы «загружается…», «загружен» + мета.
   * `attach` — только мета «формат • размер» без слова статуса.
   * @default 'edit'
   */
  fileContext?: 'edit' | 'attach'
  uploadDedupeServerFiles?: Pick<SubmissionFile, 'filename' | 'sizeBytes'>[]
}

export function SubmissionFileUpload({
  hackathonId,
  submissionId,
  onAllUploaded,
  fileContext = 'edit',
  uploadDedupeServerFiles,
}: SubmissionFileUploadProps) {
  const t = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FileState[]>([])
  const uploadMutation = useUploadSubmissionFileMutation(hackathonId)

  const serverDoneKeys = useMemo(() => {
    if (fileContext !== 'edit' || !uploadDedupeServerFiles?.length) return null
    return new Set(
      uploadDedupeServerFiles.map(f => uploadRowDedupeKey(f.filename, f.sizeBytes))
    )
  }, [fileContext, uploadDedupeServerFiles])

  const visibleFiles = useMemo(() => {
    if (!serverDoneKeys) return files
    return files.filter(fs => {
      if (fs.status !== 'done') return true
      return !serverDoneKeys.has(uploadRowDedupeKey(fs.file.name, fs.file.size))
    })
  }, [files, serverDoneKeys])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    if (!picked.length) return

    const newStates: FileState[] = picked.map(f => {
      const validationError = validateSubmissionFile(f)
      return {
        file: f,
        status: validationError ? ('error' as const) : ('pending' as const),
        validationError: validationError ?? undefined,
      }
    })
    setFiles(prev => [...prev, ...newStates])

    let allUploadedOk = picked.length > 0
    for (let i = 0; i < picked.length; i++) {
      const file = picked[i]
      if (validateSubmissionFile(file)) {
        allUploadedOk = false
        continue
      }
      setFiles(prev =>
        prev.map((fs, idx) =>
          idx === prev.length - picked.length + i ? { ...fs, status: 'uploading' } : fs
        )
      )
      try {
        await uploadMutation.mutateAsync({ submissionId, file })
        setFiles(prev =>
          prev.map((fs, idx) =>
            idx === prev.length - picked.length + i ? { ...fs, status: 'done' } : fs
          )
        )
      } catch {
        setFiles(prev =>
          prev.map((fs, idx) =>
            idx === prev.length - picked.length + i ? { ...fs, status: 'error' } : fs
          )
        )
        allUploadedOk = false
      }
    }

    if (allUploadedOk) onAllUploaded?.()
    e.target.value = ''
  }

  const statusMainText = (fs: FileState) => {
    switch (fs.status) {
      case 'uploading':
        return t('hackathons.detail.participation.submission.fileUpload.uploading')
      case 'done':
        return t('hackathons.detail.participation.submission.fileUpload.uploaded')
      case 'error':
        if (fs.validationError === 'invalid_type') {
          return t('hackathons.detail.participation.submission.fileUpload.invalidFileType')
        }
        if (fs.validationError === 'too_large') {
          return t('hackathons.detail.participation.submission.fileUpload.fileTooLarge')
        }
        return t('hackathons.detail.participation.submission.fileUpload.error')
      default:
        return ''
    }
  }

  const fileMetaForRow = (fs: FileState) =>
    fileContext === 'attach'
      ? submissionFileMetaPlain(fs.file.name, fs.file.size)
      : submissionFileMetaSuffix(fs.file.name, fs.file.size)

  return (
    <div className="flex flex-col gap-m4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={SUBMISSION_FILE_ACCEPT}
        className="hidden"
        onChange={handleFileChange}
      />

      {visibleFiles.length > 0 && (
        <div className="flex flex-col gap-m4">
          {visibleFiles.map(fs => (
            <SubmissionFileListItemRow
              key={`${fs.file.name}-${fs.file.size}-${fs.file.lastModified}-${fs.status}`}
              filename={fs.file.name}
              rightContent={
                fs.status !== 'pending' ? (
                  <span className="typography-label-sm shrink-0 max-w-[min(100%,20rem)] text-right">
                    {fs.status === 'error' ? (
                      <>
                        <span className="text-state-error">{statusMainText(fs)}</span>
                        <span className="text-text-tertiary">
                          {' '}
                          {submissionFileMetaPlain(fs.file.name, fs.file.size)}
                        </span>
                      </>
                    ) : fileContext === 'attach' ? (
                      <span className="text-text-secondary">{fileMetaForRow(fs)}</span>
                    ) : (
                      <span className="text-text-secondary">
                        {statusMainText(fs)} {fileMetaForRow(fs)}
                      </span>
                    )}
                  </span>
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      <Button
        variant="secondary"
        size="sm"
        text={t('hackathons.detail.participation.submission.editModal.addFiles')}
        onClick={() => inputRef.current?.click()}
      />
    </div>
  )
}
