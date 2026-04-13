'use client'

import { useMemo, useState } from 'react'
import { Button, ListItem } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useSelectFinalSubmissionMutation, useSubmissionDetailQuery } from '@/entities/submission'
import type { Submission } from '@/entities/submission'
import { formatRelativeTime } from '@/shared/lib/formatDate'
import { SubmissionViewEditModal, type SubmissionViewEditMode } from './SubmissionViewEditModal'

export interface SubmissionListProps {
  hackathonId: string
  submissions: Submission[]
  canEdit: boolean
  canSelectFinal: boolean
}

type SubmissionModalState = {
  submission: Submission
  mode: SubmissionViewEditMode
}

export function SubmissionList({
  hackathonId,
  submissions,
  canEdit,
  canSelectFinal,
}: SubmissionListProps) {
  const selectFinalMutation = useSelectFinalSubmissionMutation(hackathonId)
  const [submissionModal, setSubmissionModal] = useState<SubmissionModalState | null>(null)

  const detailQuery = useSubmissionDetailQuery(
    hackathonId,
    submissionModal?.submission.submissionId ?? null,
    submissionModal !== null
  )

  const displaySubmission = useMemo((): Submission | null => {
    if (!submissionModal) return null
    return detailQuery.data ?? submissionModal.submission
  }, [submissionModal, detailQuery.data])

  // Sort: final first, then by creation date desc
  const sorted = [...submissions].sort((a, b) => {
    if (a.isFinal !== b.isFinal) return a.isFinal ? -1 : 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <>
      <div className="flex flex-col gap-m4">
        {sorted.map(sub => (
          <SubmissionRow
            key={sub.submissionId}
            submission={sub}
            canSelectFinal={canSelectFinal && !sub.isFinal}
            isSelectingFinal={
              selectFinalMutation.isPending && selectFinalMutation.variables === sub.submissionId
            }
            onSelectFinal={() => selectFinalMutation.mutate(sub.submissionId)}
            onView={() => setSubmissionModal({ submission: sub, mode: 'view' })}
          />
        ))}
      </div>

      {submissionModal && displaySubmission && (
        <SubmissionViewEditModal
          open
          onClose={() => setSubmissionModal(null)}
          hackathonId={hackathonId}
          submission={displaySubmission}
          mode={submissionModal.mode}
          onModeChange={mode => setSubmissionModal(prev => (prev ? { ...prev, mode } : null))}
          canEdit={canEdit}
        />
      )}
    </>
  )
}

interface SubmissionRowProps {
  submission: Submission
  canSelectFinal: boolean
  isSelectingFinal: boolean
  onSelectFinal: () => void
  onView: () => void
}

function SubmissionRow({
  submission,
  canSelectFinal,
  isSelectingFinal,
  onSelectFinal,
  onView,
}: SubmissionRowProps) {
  const t = useT()
  const relativeTime = formatRelativeTime(submission.createdAt)
  const caption = submission.isFinal
    ? `${relativeTime} \u2022 ${t('hackathons.detail.participation.submission.finalBadge')}`
    : relativeTime

  return (
    <ListItem
      variant="bordered"
      text={submission.title}
      caption={caption}
      onClick={onView}
      rightContent={
        canSelectFinal ? (
          <div onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="xs"
              onClick={onSelectFinal}
              disabled={isSelectingFinal}
            >
              {t('hackathons.detail.participation.submission.makeFinalButton')}
            </Button>
          </div>
        ) : undefined
      }
    />
  )
}
