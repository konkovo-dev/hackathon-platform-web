'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Section, ListItem, Chip, Modal, Divider, Icon } from '@/shared/ui'
import { useI18n, useT } from '@/shared/i18n/useT'
import { formatRelativeTime } from '@/shared/lib/formatDate'
import { routes } from '@/shared/config/routes'
import { useTeamsQuery } from '@/features/teams-list'
import { useFinalSubmissionQuery, type OwnerKind } from '@/entities/submission'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { listParticipations } from '@/entities/hackathon/api/listParticipations'
import { listTeamMembers, useTeamQuery } from '@/entities/team'
import type { User } from '@/entities/user'
import { UserListItem, batchGetUsers } from '@/entities/user'
import { MarkdownContent } from '@/shared/ui'
import { SubmissionFileListItems } from './SubmissionFileListItems'

export interface StaffSubmissionsSectionProps {
  hackathon: Hackathon
}

export function StaffSubmissionsSection({ hackathon }: StaffSubmissionsSectionProps) {
  const hackathonId = hackathon.hackathonId
  const stage = hackathon.stage

  if (!hackathonId) return null
  if (stage !== 'RUNNING' && stage !== 'JUDGING' && stage !== 'FINISHED') return null

  return <StaffSubmissionsSectionInner hackathonId={hackathonId} />
}

function staffDisplayNameForUser(user: User | undefined, userId: string) {
  if (!user) return userId
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return full || user.username || userId
}

function StaffSubmissionsSectionInner({ hackathonId }: { hackathonId: string }) {
  const t = useT()
  const { data: teamsData, isLoading: teamsLoading } = useTeamsQuery(hackathonId)
  const teams = teamsData?.teams ?? []

  const { data: participationsData, isLoading: participationsLoading } = useQuery({
    queryKey: ['hackathon', hackathonId, 'participations', 'staff-submissions', 'PART_INDIVIDUAL'],
    queryFn: () =>
      listParticipations(hackathonId, {
        statusFilter: { statuses: ['PART_INDIVIDUAL'] },
      }),
    enabled: Boolean(hackathonId),
    staleTime: 15_000,
  })

  const individualUserIds = useMemo(() => {
    const list = participationsData?.participants ?? []
    const seen = new Set<string>()
    const ids: string[] = []
    for (const p of list) {
      if (p.status === 'PART_INDIVIDUAL' && p.userId && !seen.has(p.userId)) {
        seen.add(p.userId)
        ids.push(p.userId)
      }
    }
    return ids
  }, [participationsData?.participants])

  const { data: usersBatch } = useQuery({
    queryKey: ['users-batch', individualUserIds],
    queryFn: async () => {
      const response = await batchGetUsers({ userIds: individualUserIds })
      return (response.users ?? [])
        .map(u => u.user)
        .filter((u): u is NonNullable<typeof u> => u != null)
    },
    enabled: individualUserIds.length > 0,
  })

  const usersById = useMemo(() => {
    const map = new Map<string, User>()
    for (const u of usersBatch ?? []) {
      if (u.userId) map.set(u.userId, u)
    }
    return map
  }, [usersBatch])

  const [viewing, setViewing] = useState<{
    ownerKind: OwnerKind
    ownerId: string
    title: string
    senderUser?: User
  } | null>(null)

  const isLoading = teamsLoading || participationsLoading

  if (isLoading) {
    return (
      <Section
        title={t('hackathons.detail.participation.submission.staff.sectionTitle')}
        variant="elevated"
      >
        <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
      </Section>
    )
  }

  if (teams.length === 0 && individualUserIds.length === 0) {
    return (
      <Section
        title={t('hackathons.detail.participation.submission.staff.sectionTitle')}
        variant="elevated"
      >
        <p className="typography-body-sm text-text-secondary">
          {t('hackathons.detail.participation.submission.staff.noSubmissions')}
        </p>
      </Section>
    )
  }

  return (
    <>
      <Section
        title={t('hackathons.detail.participation.submission.staff.sectionTitle')}
        variant="elevated"
      >
        <div className="flex flex-col gap-m4">
          {teams.map(teamWithVacancies => {
            const team = teamWithVacancies.team
            const teamId = team?.teamId
            if (!teamId) return null
            return (
              <TeamSubmissionRow
                key={teamId}
                hackathonId={hackathonId}
                teamId={teamId}
                teamName={team.name ?? teamId}
                onOpenModal={() =>
                  setViewing({
                    ownerKind: 'team',
                    ownerId: teamId,
                    title: team.name ?? teamId,
                  })
                }
              />
            )
          })}
          {individualUserIds.map(userId => (
            <IndividualSubmissionRow
              key={userId}
              hackathonId={hackathonId}
              userId={userId}
              displayName={staffDisplayNameForUser(usersById.get(userId), userId)}
              onOpenModal={() =>
                setViewing({
                  ownerKind: 'user',
                  ownerId: userId,
                  title: staffDisplayNameForUser(usersById.get(userId), userId),
                  senderUser: usersById.get(userId),
                })
              }
            />
          ))}
        </div>
      </Section>

      {viewing && (
        <StaffSubmissionViewModal
          open
          onClose={() => setViewing(null)}
          hackathonId={hackathonId}
          ownerKind={viewing.ownerKind}
          ownerId={viewing.ownerId}
          title={viewing.title}
          senderUser={viewing.senderUser}
        />
      )}
    </>
  )
}

interface TeamSubmissionRowProps {
  hackathonId: string
  teamId: string
  teamName: string
  onOpenModal: () => void
}

function TeamSubmissionRow({ hackathonId, teamId, teamName, onOpenModal }: TeamSubmissionRowProps) {
  const t = useT()
  const { locale } = useI18n()
  const { data: finalSubmission, isLoading } = useFinalSubmissionQuery(hackathonId, 'team', teamId)

  const hasSubmission = !isLoading && finalSubmission !== null
  const updatedCaption =
    hasSubmission && finalSubmission?.updatedAt
      ? formatRelativeTime(finalSubmission.updatedAt, locale)
      : undefined

  return (
    <ListItem
      variant="bordered"
      text={teamName}
      subtitle={
        isLoading
          ? t('hackathons.list.loading')
          : hasSubmission
            ? finalSubmission?.title
            : t('hackathons.detail.participation.submission.staff.noSubmission')
      }
      caption={updatedCaption}
      onClick={onOpenModal}
      rightContent={
        hasSubmission ? undefined : (
          <Chip
            label={t('hackathons.detail.participation.submission.staff.noSubmission')}
            variant="secondary"
          />
        )
      }
    />
  )
}

interface IndividualSubmissionRowProps {
  hackathonId: string
  userId: string
  displayName: string
  onOpenModal: () => void
}

function IndividualSubmissionRow({
  hackathonId,
  userId,
  displayName,
  onOpenModal,
}: IndividualSubmissionRowProps) {
  const t = useT()
  const { locale } = useI18n()
  const { data: finalSubmission, isLoading } = useFinalSubmissionQuery(hackathonId, 'user', userId)

  const hasSubmission = !isLoading && finalSubmission !== null
  const updatedCaption =
    hasSubmission && finalSubmission?.updatedAt
      ? formatRelativeTime(finalSubmission.updatedAt, locale)
      : undefined

  return (
    <ListItem
      variant="bordered"
      text={displayName}
      subtitle={
        isLoading
          ? t('hackathons.list.loading')
          : hasSubmission
            ? finalSubmission?.title
            : t('hackathons.detail.participation.submission.staff.noSubmission')
      }
      caption={updatedCaption}
      onClick={onOpenModal}
      rightContent={
        hasSubmission ? undefined : (
          <Chip
            label={t('hackathons.detail.participation.submission.staff.noSubmission')}
            variant="secondary"
          />
        )
      }
    />
  )
}

interface StaffSubmissionSenderNavProps {
  hackathonId: string
  ownerKind: OwnerKind
  ownerId: string
  fallbackTitle: string
  senderUser?: User
}

/** Блок навигации к отправителю (как карточки в `InvitationMessageModal`). */
function StaffSubmissionSenderNav({
  hackathonId,
  ownerKind,
  ownerId,
  fallbackTitle,
  senderUser,
}: StaffSubmissionSenderNavProps) {
  const t = useT()
  const router = useRouter()

  const isTeam = ownerKind === 'team'
  const { data: teamData, isLoading: teamLoading } = useTeamQuery(hackathonId, ownerId, {
    enabled: isTeam,
  })
  const team = teamData?.team?.team
  const tid = isTeam ? (team?.teamId ?? ownerId) : ''

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['team-members', hackathonId, tid],
    queryFn: () => listTeamMembers(hackathonId, tid),
    enabled: isTeam && Boolean(hackathonId && tid && team),
  })

  if (ownerKind === 'user') {
    return <UserListItem userId={ownerId} user={senderUser} variant="bordered" showNavigationIcon />
  }

  const memberCount = membersData?.members?.length ?? 0
  const membersLabel =
    memberCount === 1
      ? t('teams.card.member', { count: 1 })
      : t('teams.card.members', { count: memberCount })

  const teamName = team?.name?.trim() || fallbackTitle
  const subtitle = teamLoading || membersLoading ? t('teams.list.loading') : membersLabel

  const goToTeam = () => {
    router.push(routes.hackathons.teams.detail(hackathonId, tid))
  }

  return (
    <ListItem
      variant="bordered"
      text={teamName}
      subtitle={subtitle}
      onClick={goToTeam}
      rightContent={
        <Icon src="/icons/icon-arrow/icon-arrow-right-md.svg" size="md" color="secondary" />
      }
    />
  )
}

interface StaffSubmissionViewModalProps {
  open: boolean
  onClose: () => void
  hackathonId: string
  ownerKind: OwnerKind
  ownerId: string
  title: string
  senderUser?: User
}

function StaffSubmissionViewModal({
  open,
  onClose,
  hackathonId,
  ownerKind,
  ownerId,
  title,
  senderUser,
}: StaffSubmissionViewModalProps) {
  const t = useT()
  const { data: submission, isLoading } = useFinalSubmissionQuery(hackathonId, ownerKind, ownerId)

  const modalTitle = isLoading ? title : submission ? submission.title.trim() || '—' : title

  const modalSubtitle = isLoading
    ? t('hackathons.list.loading')
    : submission
      ? undefined
      : t('hackathons.detail.participation.submission.staff.noSubmission')

  return (
    <Modal open={open} onClose={onClose} size="lg" title={modalTitle} subtitle={modalSubtitle}>
      <div className="flex flex-col gap-m6">
        <StaffSubmissionSenderNav
          hackathonId={hackathonId}
          ownerKind={ownerKind}
          ownerId={ownerId}
          fallbackTitle={title}
          senderUser={senderUser}
        />

        {!isLoading && submission && (
          <div className="flex flex-col gap-m8">
            {submission.description && (
              <>
                <Divider />
                <MarkdownContent>{submission.description}</MarkdownContent>
              </>
            )}

            {submission.files.filter(f => f.uploadStatus === 'completed').length > 0 && (
              <>
                <Divider />
                <SubmissionFileListItems
                  hackathonId={hackathonId}
                  submissionId={submission.submissionId}
                  files={submission.files.filter(f => f.uploadStatus === 'completed')}
                  sectionLabel={t(
                    'hackathons.detail.participation.submission.createModal.filesLabel'
                  )}
                />
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
