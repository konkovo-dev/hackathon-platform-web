'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Section, Button, Icon, InfoRow, ListItem } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCan } from '@/shared/policy/useCan'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatRelativeTime } from '@/shared/lib/formatDate'
import { routes } from '@/shared/config/routes'
import { HackathonValidationChecklist } from '@/features/hackathon-validation/ui/HackathonValidationChecklist'
import { EditTaskModal } from '@/features/hackathon-task-edit/ui/EditTaskModal'
import { StaffList } from '@/features/staff-invite/ui/StaffList'
import { SentStaffInvitationsSection } from '@/features/staff-invite/ui/SentStaffInvitationsSection'
import { DeclinedInvitationsModal } from '@/features/staff-invite/ui/DeclinedInvitationsModal'
import { useHackathonStaffInvitationsQuery } from '@/features/staff-invite/model/hooks'
import { TeamModerationList } from '@/features/team-moderation/ui/TeamModerationList'
import { AnnouncementFormModal } from '@/features/announcement-create/ui/AnnouncementFormModal'
import { AnnouncementModal } from '@/features/hackathon-detail/ui/AnnouncementModal'
import { useHackathonAnnouncementsQuery } from '@/features/hackathon-detail/model/hooks'
import { deleteAnnouncement } from '@/entities/hackathon/api/deleteAnnouncement'
import type { Hackathon } from '@/entities/hackathon/model/types'
import type { HackathonAnnouncement } from '@/entities/hackathon/api/getHackathonAnnouncements'
import { getStageLabel } from '@/entities/hackathon/model/utils'
import { ApiError } from '@/shared/api/errors'

export interface HackathonManagementDashboardProps {
  hackathon: Hackathon
}

interface ManageableAnnouncementItemProps {
  announcement: HackathonAnnouncement
  hackathonId: string
  caption: string
  onClick: () => void
  onEdit: () => void
}

function ManageableAnnouncementItem({
  announcement,
  hackathonId,
  caption,
  onClick,
  onEdit,
}: ManageableAnnouncementItemProps) {
  const t = useT()
  const queryClient = useQueryClient()
  const [isHovered, setIsHovered] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!announcement.announcementId) {
        throw new Error('Announcement ID is required')
      }
      return deleteAnnouncement(hackathonId, announcement.announcementId, {
        'idempotencyKey.key': crypto.randomUUID(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathon', 'announcements', hackathonId] })
    },
    onError: (error: ApiError) => {
      console.error('Failed to delete announcement:', error)
    },
  })

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) return

    try {
      await deleteMutation.mutateAsync()
    } catch (error) {
      // Error is already logged in the mutation
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit()
  }

  const rightContent = isHovered ? (
    <div className="flex gap-m2" onClick={e => e.stopPropagation()}>
      <Button
        variant="icon-secondary"
        size="xs"
        onClick={handleEdit}
        aria-label="Редактировать"
        disabled={deleteMutation.isPending}
      >
        <Icon src="/icons/icon-edit/icon-edit-xs.svg" size="xs" color="secondary" />
      </Button>
      <Button
        variant="icon-secondary"
        size="xs"
        onClick={handleDelete}
        aria-label="Удалить"
        disabled={deleteMutation.isPending}
      >
        <Icon src="/icons/icon-delete/icon-delete-xs.svg" size="xs" color="secondary" />
      </Button>
    </div>
  ) : undefined

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <ListItem
        text={announcement.title ?? t('common.fallback.untitled')}
        caption={!rightContent ? caption : undefined}
        variant="bordered"
        onClick={onClick}
        rightContent={rightContent}
      />
    </div>
  )
}

export function HackathonManagementDashboard({ hackathon }: HackathonManagementDashboardProps) {
  const t = useT()
  const router = useRouter()
  const locale = 'ru'
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isDeclinedInvitationsModalOpen, setIsDeclinedInvitationsModalOpen] = useState(false)
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null)
  const [editingAnnouncement, setEditingAnnouncement] = useState<HackathonAnnouncement | null>(null)

  const { decision: canPublish } = useCan('Hackathon.Publish', {
    hackathonId: hackathon.hackathonId,
  })

  const { decision: canCreateAnnouncementDecision } = useCan('Hackathon.CreateAnnouncement', {
    hackathonId: hackathon.hackathonId,
  })

  const stageLabel = getStageLabel(hackathon.stage)

  const isDraft = hackathon.state === 'HACKATHON_STATE_DRAFT'
  const shouldShowValidation = canPublish.allowed && isDraft
  const shouldShowAnnouncements = canCreateAnnouncementDecision.allowed && !isDraft

  // Загружаем объявления только для опубликованных хакатонов
  const { data: announcements = [] } = useHackathonAnnouncementsQuery(
    hackathon.hackathonId ?? '',
    !isDraft && !!hackathon.hackathonId
  )

  const { data: staffInvitationsData } = useHackathonStaffInvitationsQuery(hackathon.hackathonId)
  const pendingCount =
    staffInvitationsData?.invitations?.filter(inv => inv.status === 'STAFF_INVITATION_PENDING')
      .length ?? 0
  const declinedCount =
    staffInvitationsData?.invitations?.filter(inv => inv.status === 'STAFF_INVITATION_DECLINED')
      .length ?? 0
  const hasSentStaffInvitations = pendingCount > 0
  const hasDeclinedInvitations = declinedCount > 0

  return (
    <div className="flex flex-col gap-m8">
      {/* Готовность к публикации */}
      {shouldShowValidation && hackathon.hackathonId && (
        <HackathonValidationChecklist hackathonId={hackathon.hackathonId} />
      )}

      <div className="grid grid-cols-2 gap-m8">
        {/* Действия */}
        <Section title={t('hackathons.management.actions.title')}>
          <div className="flex flex-col gap-m6">
            <div className="flex flex-wrap items-center gap-m4">
              <Button
                variant="secondary-action"
                text={t('hackathons.edit.actions.edit_info')}
                onClick={() =>
                  hackathon.hackathonId &&
                  router.push(routes.hackathons.edit(hackathon.hackathonId))
                }
              />
              <Button
                variant="secondary-action"
                text={t('hackathons.task.edit.title')}
                onClick={() => setIsTaskModalOpen(true)}
              />
              {hasDeclinedInvitations && hackathon.hackathonId && (
                <Button
                  variant="secondary"
                  text={`${t('hackathons.management.staff.declinedInvitations')} (${declinedCount})`}
                  onClick={() => setIsDeclinedInvitationsModalOpen(true)}
                />
              )}
            </div>
          </div>
        </Section>

        {/* Информация */}
        <Section title={t('hackathons.management.info.title')}>
          <div className="flex flex-col gap-m4">
            <InfoRow
              label={t('hackathons.management.info.stage')}
              value={t(`hackathons.stage.${stageLabel}` as any)}
            />
            <InfoRow
              label={t('hackathons.management.info.status')}
              value={t(`hackathons.state.${hackathon.state}` as any)}
            />
          </div>
        </Section>
      </div>

      {/* Staff и отправленные приглашения */}
      {hasSentStaffInvitations && hackathon.hackathonId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-m8">
          <StaffList hackathonId={hackathon.hackathonId} />
          <SentStaffInvitationsSection hackathonId={hackathon.hackathonId} />
        </div>
      ) : (
        <StaffList hackathonId={hackathon.hackathonId ?? ''} />
      )}

      {hackathon.hackathonId && (
        <DeclinedInvitationsModal
          open={isDeclinedInvitationsModalOpen}
          onClose={() => setIsDeclinedInvitationsModalOpen(false)}
          hackathonId={hackathon.hackathonId}
        />
      )}

      {/* Объявления */}
      {shouldShowAnnouncements && (
        <Section
          title={t('hackathons.management.announcements.title')}
          action={
            <Button
              variant="icon-secondary"
              size="xs"
              onClick={() => setIsAnnouncementModalOpen(true)}
              aria-label={t('hackathons.management.announcements.create')}
            >
              <Icon src="/icons/icon-plus/icon-plus-xs.svg" size="xs" color="secondary" />
            </Button>
          }
        >
          {announcements.length > 0 ? (
            <div className="flex flex-col gap-m4">
              {announcements.map(announcement => (
                <ManageableAnnouncementItem
                  key={announcement.announcementId ?? 'unknown'}
                  announcement={announcement}
                  hackathonId={hackathon.hackathonId ?? ''}
                  caption={
                    announcement.createdAt ? formatRelativeTime(announcement.createdAt, locale) : ''
                  }
                  onClick={() =>
                    announcement.announcementId &&
                    setSelectedAnnouncementId(announcement.announcementId)
                  }
                  onEdit={() => setEditingAnnouncement(announcement)}
                />
              ))}
            </div>
          ) : (
            <p className="typography-body-sm text-text-secondary">
              {t('hackathons.management.announcements.empty')}
            </p>
          )}
        </Section>
      )}

      {/* Участники и команды */}
      <TeamModerationList hackathonId={hackathon.hackathonId ?? ''} />

      <AnnouncementFormModal
        open={isAnnouncementModalOpen || !!editingAnnouncement}
        onClose={() => {
          setIsAnnouncementModalOpen(false)
          setEditingAnnouncement(null)
        }}
        hackathonId={hackathon.hackathonId ?? ''}
        announcement={editingAnnouncement}
      />

      <AnnouncementModal
        open={!!selectedAnnouncementId}
        onClose={() => setSelectedAnnouncementId(null)}
        announcementId={selectedAnnouncementId}
        hackathonId={hackathon.hackathonId ?? ''}
        locale={locale}
      />

      <EditTaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        hackathonId={hackathon.hackathonId ?? ''}
        currentTask={hackathon.task}
      />
    </div>
  )
}
