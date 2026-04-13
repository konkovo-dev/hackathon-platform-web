'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Input, MarkdownEditor } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCreateSubmissionMutation } from '@/entities/submission'
import { SubmissionFileUpload } from './SubmissionFileUpload'

export interface CreateSubmissionModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
}

type Step = 'form' | 'upload'

export function CreateSubmissionModal({ open, onClose, hackathonId }: CreateSubmissionModalProps) {
  const t = useT()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [createdSubmissionId, setCreatedSubmissionId] = useState<string | null>(null)
  const [titleError, setTitleError] = useState('')

  const createMutation = useCreateSubmissionMutation(hackathonId)

  useEffect(() => {
    if (open) {
      setTitle('')
      setDescription('')
      setStep('form')
      setCreatedSubmissionId(null)
      setTitleError('')
    }
  }, [open])

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError(t('hackathons.detail.participation.submission.createModal.titleRequired'))
      return
    }
    setTitleError('')
    try {
      const res = await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      })
      if (res.submissionId) {
        setCreatedSubmissionId(res.submissionId)
        setStep('upload')
      } else {
        onClose()
      }
    } catch {
      // error handled by mutation state
    }
  }

  const handleDone = () => {
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={t('hackathons.detail.participation.submission.createModal.title')}
    >
      {step === 'form' ? (
        <div className="flex flex-col gap-m8">
          <div className="flex flex-col gap-m4">
            <label className="typography-label-md text-text-primary">
              {t('hackathons.detail.participation.submission.createModal.titleLabel')}
            </label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t(
                'hackathons.detail.participation.submission.createModal.titlePlaceholder'
              )}
            />
            {titleError && <p className="typography-body-sm text-state-error">{titleError}</p>}
          </div>

          <div className="flex flex-col gap-m4">
            <label className="typography-label-md text-text-primary">
              {t('hackathons.detail.participation.submission.createModal.descriptionLabel')}
            </label>
            <MarkdownEditor value={description} onChange={setDescription} />
          </div>

          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              {t('hackathons.detail.participation.submission.createModal.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending
                ? t('hackathons.list.loading')
                : t('hackathons.detail.participation.submission.createModal.continue')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-m8">
          {createdSubmissionId && (
            <SubmissionFileUpload
              hackathonId={hackathonId}
              submissionId={createdSubmissionId}
              fileContext="attach"
            />
          )}

          <div className="flex justify-end">
            <Button variant="primary" size="md" onClick={handleDone}>
              {t('hackathons.detail.participation.submission.createModal.done')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
