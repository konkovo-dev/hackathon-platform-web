'use client'

import { useState } from 'react'
import { Button, Modal } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { usePublishHackathonMutation } from '../model/hooks'

export interface PublishHackathonButtonProps {
  hackathonId: string
  disabled?: boolean
}

export function PublishHackathonButton({ hackathonId, disabled }: PublishHackathonButtonProps) {
  const t = useT()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const publishMutation = usePublishHackathonMutation(hackathonId)

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync()
      setIsConfirmOpen(false)
    } catch (error) {
      // Error is already logged in the mutation
    }
  }

  return (
    <>
      <Button
        variant="primary"
        size="md"
        onClick={() => setIsConfirmOpen(true)}
        disabled={disabled || publishMutation.isPending}
      >
        {t('hackathons.management.publish.button')}
      </Button>

      <Modal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={t('hackathons.management.publish.title')}
      >
        <p className="typography-body-md text-text-primary">
          {t('hackathons.management.publish.confirm')}
        </p>

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsConfirmOpen(false)}
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
      </Modal>
    </>
  )
}
