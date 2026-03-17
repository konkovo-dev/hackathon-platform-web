'use client'

import { useState } from 'react'
import { Button, ErrorAlert, Modal } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { ApiError } from '@/shared/api/errors'
import { usePublishHackathonMutation } from '../model/hooks'

export interface PublishHackathonButtonProps {
  hackathonId: string
  disabled?: boolean
}

export function PublishHackathonButton({ hackathonId, disabled }: PublishHackathonButtonProps) {
  const t = useT()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const publishMutation = usePublishHackathonMutation(hackathonId)

  const handlePublish = async () => {
    try {
      setErrorMessage(null)
      await publishMutation.mutateAsync()
      setIsConfirmOpen(false)
    } catch (error: unknown) {
      // Локализуем ошибку валидации
      let message = t('hackathons.management.publish.error')
      
      if (error instanceof ApiError) {
        message = error.message || message
      } else if (error instanceof Error) {
        message = error.message || message
      }
      
      setErrorMessage(message)
    }
  }

  return (
    <>
      <Button
        variant="primary"
        size="md"
        onClick={() => {
          setErrorMessage(null)
          setIsConfirmOpen(true)
        }}
        disabled={disabled || publishMutation.isPending}
      >
        {t('hackathons.management.publish.button')}
      </Button>

      <Modal
        open={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false)
          setErrorMessage(null)
        }}
        title={t('hackathons.management.publish.title')}
      >
        <div className="flex flex-col gap-m6">
          <div className="flex flex-col gap-m4">
            <p className="typography-body-md text-text-primary">
              {t('hackathons.management.publish.confirm_question')}
            </p>
            <p className="typography-body-sm-regular text-text-secondary">
              {t('hackathons.management.publish.confirm_info')}
            </p>
          </div>

          {errorMessage && <ErrorAlert message={errorMessage} />}

          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setIsConfirmOpen(false)
                setErrorMessage(null)
              }}
              disabled={publishMutation.isPending}
            >
              {t('hackathons.create.actions.cancel')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handlePublish}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending
                ? t('hackathons.list.loading')
                : t('hackathons.management.publish.button')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
