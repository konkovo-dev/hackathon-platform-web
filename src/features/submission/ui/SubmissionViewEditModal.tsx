'use client'

import { Modal, Button, Divider } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import type { Submission } from '@/entities/submission'
import { ViewSubmissionContent } from './ViewSubmissionModal'
import { EditSubmissionForm } from './EditSubmissionModal'

export type SubmissionViewEditMode = 'view' | 'edit'

export interface SubmissionViewEditModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  submission: Submission
  mode: SubmissionViewEditMode
  onModeChange: (mode: SubmissionViewEditMode) => void
  canEdit: boolean
}

export function SubmissionViewEditModal({
  open,
  onClose,
  hackathonId,
  submission,
  mode,
  onModeChange,
  canEdit,
}: SubmissionViewEditModalProps) {
  const t = useT()

  const finalBadge = t('hackathons.detail.participation.submission.finalBadge')
  const title =
    mode === 'view'
      ? submission.isFinal
        ? `${submission.title} \u2022 ${finalBadge}`
        : submission.title
      : t('hackathons.detail.participation.submission.editModal.title')

  return (
    <Modal open={open} onClose={onClose} size="lg" title={title}>
      {mode === 'view' ? (
        <div className="flex flex-col gap-m8">
          <ViewSubmissionContent hackathonId={hackathonId} submission={submission} />
          {canEdit && (
            <>
              <Divider />
              <div className="flex justify-end">
                <Button variant="secondary" size="md" onClick={() => onModeChange('edit')}>
                  {t('hackathons.detail.participation.submission.editButton')}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <EditSubmissionForm
          hackathonId={hackathonId}
          submission={submission}
          onCancel={() => onModeChange('view')}
          onSaved={onClose}
        />
      )}
    </Modal>
  )
}
