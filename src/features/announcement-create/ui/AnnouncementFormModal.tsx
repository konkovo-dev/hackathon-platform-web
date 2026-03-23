'use client'

import { useState, useEffect } from 'react'
import { Modal, Input, Button, MarkdownEditor } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createAnnouncement,
  type CreateAnnouncementResponse,
} from '@/entities/hackathon/api/createAnnouncement'
import {
  updateAnnouncement,
  type UpdateAnnouncementResponse,
} from '@/entities/hackathon/api/updateAnnouncement'
import type { HackathonAnnouncement } from '@/entities/hackathon/api/getHackathonAnnouncements'
import { ApiError } from '@/shared/api/errors'

export interface AnnouncementFormModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  announcement?: HackathonAnnouncement | null
}

export function AnnouncementFormModal({
  open,
  onClose,
  hackathonId,
  announcement,
}: AnnouncementFormModalProps) {
  const t = useT()
  const queryClient = useQueryClient()
  const isEditMode = !!announcement

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (open) {
      setTitle(announcement?.title || '')
      setBody(announcement?.body || '')
    }
  }, [open, announcement])

  const mutation = useMutation<
    CreateAnnouncementResponse | UpdateAnnouncementResponse,
    ApiError,
    { title: string; body: string }
  >({
    mutationFn: (params: { title: string; body: string }) => {
      if (isEditMode && announcement?.announcementId) {
        return updateAnnouncement(hackathonId, announcement.announcementId, {
          idempotencyKey: { key: crypto.randomUUID() },
          ...params,
        })
      }
      return createAnnouncement(hackathonId, {
        idempotencyKey: { key: crypto.randomUUID() },
        ...params,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'announcements', hackathonId] })
      handleClose()
    },
    onError: (error: ApiError) => {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} announcement:`, error)
    },
  })

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return

    try {
      await mutation.mutateAsync({ title, body })
    } catch (error) {
      // Error is already logged in the mutation
    }
  }

  const handleClose = () => {
    onClose()
    setTitle('')
    setBody('')
  }

  const modalTitle = isEditMode
    ? t('hackathons.management.announcements.edit')
    : t('hackathons.management.announcements.create')

  const submitButtonLabel = isEditMode
    ? t('hackathons.management.announcements.save')
    : t('hackathons.management.announcements.publish')

  return (
    <Modal open={open} onClose={handleClose} title={modalTitle} size="lg">
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
          <Button variant="secondary" size="md" onClick={handleClose} disabled={mutation.isPending}>
            {t('hackathons.create.actions.cancel')}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim() || mutation.isPending}
          >
            {mutation.isPending ? t('hackathons.list.loading') : submitButtonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
