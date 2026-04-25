'use client'

import { useState } from 'react'
import { Section, Button, Divider, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import {
  useMySubmissionsQuery,
  useFinalSubmissionQuery,
  useSubmissionDetailQuery,
  type OwnerKind,
} from '@/entities/submission'
import { useCan } from '@/shared/policy/useCan'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'
import { useMyParticipationQuery } from '@/entities/hackathon-context/model/hooks'
import { SubmissionList } from './SubmissionList'
import { CreateSubmissionModal } from './CreateSubmissionModal'
import { MarkdownContent } from '@/shared/ui'
import { SubmissionFileListItems } from './SubmissionFileListItems'

export interface SubmissionBlockProps {
  hackathonId: string
  hackathonStage: HackathonStage
  submissionOwnerKind: OwnerKind
  submissionOwnerId: string | null
  submissionOwnerPending?: boolean
}

export function SubmissionBlock({
  hackathonId,
  hackathonStage,
  submissionOwnerKind,
  submissionOwnerId,
  submissionOwnerPending = false,
}: SubmissionBlockProps) {
  const t = useT()
  const [createOpen, setCreateOpen] = useState(false)

  const { decision: selectFinalDecision, isLoading: selectFinalPermissionLoading } = useCan(
    'Submission.SelectFinal',
    { hackathonId }
  )

  const submissionsQuery = useMySubmissionsQuery(hackathonId)
  const submissions = submissionsQuery.data ?? []
  const listFinalSubmission = submissions.find(s => s.isFinal) ?? null

  const isRunning = hackathonStage === 'RUNNING'
  const isPostRun = hackathonStage === 'JUDGING' || hackathonStage === 'FINISHED'

  const participationQuery = useMyParticipationQuery(hackathonId)
  const participationStatus = participationQuery.data?.status ?? null
  const isActiveParticipant =
    participationStatus === 'PART_INDIVIDUAL' ||
    participationStatus === 'PART_LOOKING_FOR_TEAM' ||
    participationStatus === 'PART_TEAM_MEMBER' ||
    participationStatus === 'PART_TEAM_CAPTAIN'
  const canCreateSubmissions = isRunning && isActiveParticipant

  const fetchFinalFromParticipantApi = isPostRun && Boolean(submissionOwnerId)

  const finalSubmissionDetailQuery = useFinalSubmissionQuery(
    hackathonId,
    fetchFinalFromParticipantApi ? submissionOwnerKind : null,
    fetchFinalFromParticipantApi ? submissionOwnerId : null
  )

  const finalSubmission =
    finalSubmissionDetailQuery.data ?? listFinalSubmission ?? null

  const completedFilesOnFinal = (
    finalSubmission?.files.filter(f => f.uploadStatus === 'completed') ?? []
  ).length
  const shouldHydrateSubmissionFiles =
    isPostRun &&
    Boolean(finalSubmission?.submissionId) &&
    completedFilesOnFinal === 0

  const submissionFilesDetailQuery = useSubmissionDetailQuery(
    hackathonId,
    finalSubmission?.submissionId ?? null,
    shouldHydrateSubmissionFiles
  )

  const postRunCompletedFiles =
    completedFilesOnFinal > 0
      ? (finalSubmission?.files.filter(f => f.uploadStatus === 'completed') ?? [])
      : (submissionFilesDetailQuery.data?.files.filter(f => f.uploadStatus === 'completed') ?? [])

  const canSelectFinal = isRunning && selectFinalDecision.allowed
  const canEdit = isRunning

  if (
    submissionsQuery.isLoading ||
    (hackathonStage === 'RUNNING' && selectFinalPermissionLoading) ||
    (hackathonStage === 'RUNNING' && participationQuery.isLoading) ||
    submissionOwnerPending ||
    (fetchFinalFromParticipantApi && finalSubmissionDetailQuery.isPending) ||
    (shouldHydrateSubmissionFiles && submissionFilesDetailQuery.isPending)
  ) {
    return (
      <Section
        title={t('hackathons.detail.participation.submission.sectionTitle')}
        variant="elevated"
      >
        <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
      </Section>
    )
  }

  // Read-only view for post-running stages
  if (isPostRun) {
    return (
      <Section
        title={t('hackathons.detail.participation.submission.readonlyTitle')}
        variant="elevated"
      >
        {finalSubmission ? (
          <div className="flex flex-col gap-m4">
            <div className="flex items-center flex-wrap gap-m2">
              <span className="typography-label-md text-text-primary">{finalSubmission.title}</span>
              <span className="typography-body-sm-regular text-text-secondary whitespace-nowrap">
                {'\u2022'} {t('hackathons.detail.participation.submission.finalBadge')}
              </span>
            </div>
            {finalSubmission.description && (
              <>
                <Divider />
                <MarkdownContent>{finalSubmission.description}</MarkdownContent>
              </>
            )}
            {postRunCompletedFiles.length > 0 && finalSubmission.submissionId && (
              <>
                <Divider />
                <SubmissionFileListItems
                  hackathonId={hackathonId}
                  submissionId={finalSubmission.submissionId}
                  files={postRunCompletedFiles}
                  sectionLabel={t(
                    'hackathons.detail.participation.submission.createModal.filesLabel'
                  )}
                />
              </>
            )}
          </div>
        ) : (
          <p className="typography-body-sm text-text-secondary">
            {t('hackathons.detail.participation.submission.noSubmissions')}
          </p>
        )}
      </Section>
    )
  }

  // Full editing view during RUNNING
  if (!isRunning) return null

  return (
    <>
      <Section
        title={t('hackathons.detail.participation.submission.sectionTitle')}
        variant="elevated"
        hoverAction={
          submissions.length > 0 && canCreateSubmissions ? (
            <Button
              variant="icon-secondary"
              size="xs"
              onClick={() => setCreateOpen(true)}
              aria-label={t('hackathons.detail.participation.submission.newVersionButton')}
            >
              <Icon src="/icons/icon-plus/icon-plus-xs.svg" size="xs" color="secondary" />
            </Button>
          ) : undefined
        }
      >
        {submissions.length === 0 ? (
          <div className="flex flex-col gap-m8 items-start">
            <p className="typography-body-sm text-text-secondary">
              {t('hackathons.detail.participation.submission.noSubmissions')}
            </p>
            {!canCreateSubmissions ? (
              <p className="typography-body-sm text-text-tertiary">
                {t('hackathons.detail.participation.submission.createForbidden')}
              </p>
            ) : null}
            <Button
              variant="primary"
              size="md"
              onClick={() => setCreateOpen(true)}
              disabled={!canCreateSubmissions}
            >
              {t('hackathons.detail.participation.submission.createButton')}
            </Button>
          </div>
        ) : (
          <SubmissionList
            hackathonId={hackathonId}
            submissions={submissions}
            canEdit={canEdit}
            canSelectFinal={canSelectFinal}
          />
        )}
      </Section>

      <CreateSubmissionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        hackathonId={hackathonId}
      />
    </>
  )
}
