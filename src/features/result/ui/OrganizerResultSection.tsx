'use client'

import { useEffect, useState } from 'react'
import { Section, Button, MarkdownEditor, MarkdownContent, Modal, ErrorAlert, Chip } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { ApiError } from '@/shared/api/errors'
import {
  useHackathonResultQuery,
  usePublishHackathonResultMutation,
  useUpdateHackathonResultDraftMutation,
} from '../model/hooks'

export interface OrganizerResultSectionProps {
  hackathonId: string
  resultPublished: boolean
  canUpdateResultDraft: boolean
  canPublishResult: boolean
}

export function OrganizerResultSection({
  hackathonId,
  resultPublished,
  canUpdateResultDraft,
  canPublishResult,
}: OrganizerResultSectionProps) {
  const t = useT()
  const resultQuery = useHackathonResultQuery(hackathonId, true)
  const updateMutation = useUpdateHackathonResultDraftMutation(hackathonId)
  const publishMutation = usePublishHackathonResultMutation(hackathonId)

  const loadedText = resultQuery.data?.result ?? ''
  const [draft, setDraft] = useState(loadedText)
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!resultQuery.isFetching) {
      setDraft(loadedText)
    }
  }, [loadedText, resultQuery.isFetching])

  const handleSave = async () => {
    try {
      setSaveError(null)
      await updateMutation.mutateAsync(draft)
    } catch (e: unknown) {
      const message =
        e instanceof ApiError ? e.message : e instanceof Error ? e.message : t('hackathons.results.organizer.saveError')
      setSaveError(message || t('hackathons.results.organizer.saveError'))
    }
  }

  const handlePublish = async () => {
    try {
      setPublishError(null)
      await publishMutation.mutateAsync()
      setPublishOpen(false)
    } catch (e: unknown) {
      const message =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : t('hackathons.results.organizer.publishError')
      setPublishError(message || t('hackathons.results.organizer.publishError'))
    }
  }

  if (resultQuery.isLoading) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('hackathons.list.loading')}</p>
      </div>
    )
  }

  if (resultQuery.isError) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('hackathons.results.organizer.loadError')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-m16">
      <Section title={t('hackathons.results.organizer.draftTitle')}>
        <div className="flex flex-col gap-m6">
          {resultPublished ? (
            <Chip
              className="self-start"
              label={t('hackathons.results.organizer.publishedBadge')}
              variant="secondary"
            />
          ) : null}

          {resultPublished ? (
            <MarkdownContent>{loadedText}</MarkdownContent>
          ) : canUpdateResultDraft ? (
            <MarkdownEditor
              value={draft}
              onChange={setDraft}
              placeholder={t('hackathons.results.organizer.placeholder')}
              disabled={updateMutation.isPending}
            />
          ) : (
            <MarkdownContent>{loadedText}</MarkdownContent>
          )}

          {saveError ? <ErrorAlert message={saveError} /> : null}

          {!resultPublished && canUpdateResultDraft ? (
            <div className="flex flex-wrap gap-m4">
              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? t('hackathons.list.loading') : t('hackathons.results.organizer.saveDraft')}
              </Button>
            </div>
          ) : null}

          {!resultPublished && canPublishResult ? (
            <div className="flex flex-wrap gap-m4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setPublishError(null)
                  setPublishOpen(true)
                }}
                disabled={publishMutation.isPending}
              >
                {t('hackathons.results.organizer.publish')}
              </Button>
            </div>
          ) : null}
        </div>
      </Section>

      <Modal
        open={publishOpen}
        onClose={() => {
          setPublishOpen(false)
          setPublishError(null)
        }}
        title={t('hackathons.results.organizer.publishConfirmTitle')}
      >
        <div className="flex flex-col gap-m6">
          <p className="typography-body-md text-text-primary">
            {t('hackathons.results.organizer.publishConfirmBody')}
          </p>
          {publishError ? <ErrorAlert message={publishError} /> : null}
          <div className="flex gap-m4 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setPublishOpen(false)
                setPublishError(null)
              }}
              disabled={publishMutation.isPending}
            >
              {t('hackathons.create.actions.cancel')}
            </Button>
            <Button variant="primary" size="md" onClick={handlePublish} disabled={publishMutation.isPending}>
              {publishMutation.isPending ? t('hackathons.list.loading') : t('hackathons.results.organizer.publish')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
