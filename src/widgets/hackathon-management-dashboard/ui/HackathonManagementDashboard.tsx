'use client'

import { useState } from 'react'
import { Section, Button, Chip, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useCan } from '@/shared/policy/useCan'
import { PublishHackathonButton } from '@/features/hackathon-publish/ui/PublishHackathonButton'
import { StaffList } from '@/features/staff-invite/ui/StaffList'
import { TeamModerationList } from '@/features/team-moderation/ui/TeamModerationList'
import { AnnouncementCreateModal } from '@/features/announcement-create/ui/AnnouncementCreateModal'
import { useHackathonAnnouncementsQuery } from '@/features/hackathon-detail/model/hooks'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { getStageLabel } from '@/entities/hackathon/model/utils'

export interface HackathonManagementDashboardProps {
  hackathon: Hackathon
}

export function HackathonManagementDashboard({ hackathon }: HackathonManagementDashboardProps) {
  const t = useT()
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)

  const { decision: canPublish } = useCan('Hackathon.Publish', {
    hackathonId: hackathon.hackathonId,
  })
  
  const { decision: canCreateAnnouncementDecision } = useCan('Hackathon.CreateAnnouncement', {
    hackathonId: hackathon.hackathonId,
  })

  const { data: announcements = [] } = useHackathonAnnouncementsQuery(hackathon.hackathonId)

  const stageLabel = getStageLabel(hackathon.stage)

  return (
    <div className="flex flex-col gap-m8">
      {/* Статус хакатона */}
      <Section title={t('hackathons.management.status.title')}>
        <div className="flex flex-col gap-m6">
          <div className="flex items-center gap-m4">
            <span className="typography-body-md text-text-secondary">
              {t('hackathons.management.status.currentStage')}:
            </span>
            <Chip label={t(`hackathons.stage.${stageLabel}` as any)} />
          </div>

          {canPublish.allowed && (
            <PublishHackathonButton
              hackathonId={hackathon.hackathonId}
              disabled={!canPublish.allowed}
            />
          )}
        </div>
      </Section>

      {/* Staff */}
      <StaffList hackathonId={hackathon.hackathonId} />

      {/* Объявления */}
      {canCreateAnnouncementDecision.allowed && (
        <Section
          title={t('hackathons.management.announcements.title')}
          action={
            <Button
              variant="icon"
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
                <div
                  key={announcement.announcementId}
                  className="typography-body-sm text-text-primary"
                >
                  {announcement.text.substring(0, 100)}
                  {announcement.text.length > 100 ? '...' : ''}
                </div>
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
      <TeamModerationList hackathonId={hackathon.hackathonId} />

      <AnnouncementCreateModal
        open={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        hackathonId={hackathon.hackathonId}
      />
    </div>
  )
}
