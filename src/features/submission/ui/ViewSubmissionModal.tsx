'use client'

import { Divider, MarkdownContent } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import type { Submission } from '@/entities/submission'
import { SubmissionFileListItems } from './SubmissionFileListItems'

export interface ViewSubmissionContentProps {
  hackathonId: string
  submission: Submission
}

/** Тело просмотра сабмишена (без обёртки Modal). */
export function ViewSubmissionContent({ hackathonId, submission }: ViewSubmissionContentProps) {
  const t = useT()
  const completedFiles = submission.files.filter(f => f.uploadStatus === 'completed')

  return (
    <div className="flex flex-col gap-m8">
      {submission.description && (
        <MarkdownContent>{submission.description}</MarkdownContent>
      )}

      {completedFiles.length > 0 && (
        <>
          {submission.description && <Divider />}
          <SubmissionFileListItems
            hackathonId={hackathonId}
            submissionId={submission.submissionId}
            files={completedFiles}
            sectionLabel={t('hackathons.detail.participation.submission.createModal.filesLabel')}
          />
        </>
      )}
    </div>
  )
}
