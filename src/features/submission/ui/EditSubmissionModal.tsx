'use client'

import { useState, useEffect } from 'react'
import { Button, MarkdownEditor, Divider } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useUpdateSubmissionMutation } from '@/entities/submission'
import type { Submission } from '@/entities/submission'
import { SubmissionFileUpload } from './SubmissionFileUpload'
import { SubmissionFileListItems } from './SubmissionFileListItems'

export interface EditSubmissionFormProps {
  hackathonId: string
  submission: Submission
  onCancel: () => void
  onSaved: () => void
}

export function EditSubmissionForm({
  hackathonId,
  submission,
  onCancel,
  onSaved,
}: EditSubmissionFormProps) {
  const t = useT()
  const [description, setDescription] = useState('')
  const updateMutation = useUpdateSubmissionMutation(hackathonId)

  useEffect(() => {
    setDescription(submission.description ?? '')
  }, [submission.submissionId, submission.description])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        submissionId: submission.submissionId,
        description: description.trim() || undefined,
      })
      onSaved()
    } catch {
      // error handled by mutation state
    }
  }

  const completedFiles = submission.files.filter(f => f.uploadStatus === 'completed')

  return (
    <div className="flex flex-col gap-m8">
      <div className="flex flex-col gap-m4">
        <label className="typography-label-md text-text-primary">
          {t('hackathons.detail.participation.submission.editModal.descriptionLabel')}
        </label>
        <MarkdownEditor value={description} onChange={setDescription} />
      </div>

      {completedFiles.length > 0 ? (
        <div className="flex flex-col gap-m4">
          <Divider />
          <SubmissionFileListItems
            hackathonId={hackathonId}
            submissionId={submission.submissionId}
            files={completedFiles}
            sectionLabel={t('hackathons.detail.participation.submission.editModal.filesLabel')}
            listVariant="edit"
          />
          <SubmissionFileUpload
            hackathonId={hackathonId}
            submissionId={submission.submissionId}
            fileContext="edit"
            uploadDedupeServerFiles={completedFiles}
          />
        </div>
      ) : (
        <SubmissionFileUpload
          hackathonId={hackathonId}
          submissionId={submission.submissionId}
          fileContext="edit"
          uploadDedupeServerFiles={completedFiles}
        />
      )}

      <div className="flex gap-m4 justify-end">
        <Button variant="secondary" size="md" onClick={onCancel} disabled={updateMutation.isPending}>
          {t('hackathons.detail.participation.submission.editModal.cancel')}
        </Button>
        <Button variant="primary" size="md" onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending
            ? t('hackathons.list.loading')
            : t('hackathons.detail.participation.submission.editModal.save')}
        </Button>
      </div>
    </div>
  )
}
