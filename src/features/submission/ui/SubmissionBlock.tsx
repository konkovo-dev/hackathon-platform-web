'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Section, Button, Divider, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useMySubmissionsQuery } from '@/entities/submission'
import { useSessionQuery } from '@/features/auth/model/hooks'
import { listTeamMembers } from '@/entities/team'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'
import { SubmissionList } from './SubmissionList'
import { CreateSubmissionModal } from './CreateSubmissionModal'
import { MarkdownContent } from '@/shared/ui'

export interface SubmissionBlockProps {
  hackathonId: string
  hackathonStage: HackathonStage
  myTeamId: string | null
}

export function SubmissionBlock({ hackathonId, hackathonStage, myTeamId }: SubmissionBlockProps) {
  const t = useT()
  const sessionQuery = useSessionQuery()
  const session = sessionQuery.data
  const [createOpen, setCreateOpen] = useState(false)

  const sessionUserId =
    session?.active && session.userId && session.userId.length > 0 ? session.userId : null

  const ownerKind = myTeamId ? 'team' : 'user'

  // TODO: Replace the captain check below with useCan('Submission.SelectFinal', { hackathonId })
  // once the backend exposes a dedicated permission for finalizing a submission
  // (per-participant for individuals, captain-only for teams, RUNNING stage only).
  // Tracking: hackaton-platform-api — add Submission.SelectFinal to GetSubmissionPermissions.

  // Fetch team members to check isCaptain directly from TeamMember.isCaptain flag.
  // This is stage-independent unlike permission-based proxies (e.g. transferCaptain is REGISTRATION-only).
  // Uses the same cache key as ParticipationTeamCard so no extra network request.
  const { data: membersData } = useQuery({
    queryKey: ['team-members', hackathonId, myTeamId],
    queryFn: () => listTeamMembers(hackathonId, myTeamId!),
    enabled: Boolean(myTeamId && hackathonId),
  })
  const isCaptain =
    myTeamId !== null &&
    (membersData?.members ?? []).some(
      m => m.userId === sessionUserId && m.isCaptain === true
    )

  const submissionsQuery = useMySubmissionsQuery(hackathonId)
  const submissions = submissionsQuery.data ?? []
  const finalSubmission = submissions.find(s => s.isFinal) ?? null

  const isRunning = hackathonStage === 'RUNNING'
  const isPostRun = hackathonStage === 'JUDGING' || hackathonStage === 'FINISHED'

  // individual participants can always select final; team members need to be captain
  const canSelectFinal = isRunning && (ownerKind === 'user' || isCaptain)
  const canEdit = isRunning

  if (submissionsQuery.isLoading) {
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
            {finalSubmission.files.filter(f => f.uploadStatus === 'completed').length > 0 && (
              <>
                <Divider />
                <div className="flex flex-col gap-m2">
                  {finalSubmission.files
                    .filter(f => f.uploadStatus === 'completed')
                    .map(f => (
                      <span key={f.fileId} className="typography-body-sm text-text-primary">
                        {f.filename}
                      </span>
                    ))}
                </div>
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
          submissions.length > 0 ? (
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
            <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
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
