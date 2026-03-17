'use client'

import { useState, useEffect } from 'react'
import { ErrorAlert, Modal, Button, MarkdownEditor } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { localizeValidationError } from '@/shared/lib/validation/localizeValidationError'
import { useUpdateHackathonTaskMutation } from '../model/hooks'

export interface EditTaskModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  currentTask?: string
}

export function EditTaskModal({ open, onClose, hackathonId, currentTask = '' }: EditTaskModalProps) {
  const t = useT()
  const [task, setTask] = useState(currentTask)
  const [error, setError] = useState<string | null>(null)
  const mutation = useUpdateHackathonTaskMutation()

  useEffect(() => {
    if (open) {
      setTask(currentTask)
      setError(null)
    }
  }, [open, currentTask])

  const handleSave = async () => {
    try {
      setError(null)
      const response = await mutation.mutateAsync({
        hackathonId,
        task,
      })

      if (response.validationErrors && response.validationErrors.length > 0) {
        setError(
          response.validationErrors
            .map(err => localizeValidationError(err, t))
            .join('; ')
        )
        return
      }

      onClose()
    } catch (err: unknown) {
      console.error('Failed to update task:', err)
      setError(t('hackathons.task.errors.update_failed'))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('hackathons.task.edit.title')} size="lg">
      <div className="flex flex-col gap-m6">
        <p className="typography-body-sm-regular text-text-secondary">
          {t('hackathons.task.edit.description')}
        </p>

        <MarkdownEditor
          value={task}
          onChange={setTask}
          placeholder={t('hackathons.task.edit.placeholder')}
          disabled={mutation.isPending}
        />

        {error && <ErrorAlert message={error} />}

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            {t('hackathons.create.actions.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? t('hackathons.list.loading')
              : t('hackathons.task.edit.save')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
