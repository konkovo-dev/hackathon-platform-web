'use client'

import { useState } from 'react'
import { Modal, Input, Button, MarkdownEditor } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCreateAnnouncementMutation } from '../model/hooks'

export interface AnnouncementCreateModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
}

export function AnnouncementCreateModal({
  open,
  onClose,
  hackathonId,
}: AnnouncementCreateModalProps) {
  const t = useT()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const createMutation = useCreateAnnouncementMutation(hackathonId)

  const handleCreate = async () => {
    if (!title.trim() || !body.trim()) return

    try {
      await createMutation.mutateAsync({ title, body })
      onClose()
      setTitle('')
      setBody('')
    } catch (error) {
      // Error is already logged in the mutation
    }
  }

  const handleClose = () => {
    onClose()
    setTitle('')
    setBody('')
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('hackathons.management.announcements.create')}>
      <div className="flex flex-col gap-m6">
        <Input
          type="text"
          placeholder={t('hackathons.management.announcements.titlePlaceholder')}
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />

        <MarkdownEditor
          value={body}
          onChange={setBody}
          placeholder={t('hackathons.management.announcements.bodyPlaceholder')}
        />

        <div className="flex gap-m4 justify-end">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            {t('hackathons.create.actions.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleCreate}
            disabled={!title.trim() || !body.trim() || createMutation.isPending}
          >
            {createMutation.isPending
              ? t('hackathons.list.loading')
              : t('hackathons.management.announcements.publish')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
