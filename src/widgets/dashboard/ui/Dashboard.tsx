'use client'

import { PageContainer } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { useDashboardHackathonsQuery } from '../model/hooks'
import { HackathonRoleSection } from './HackathonRoleSection'
import { QuickActions } from './QuickActions'
import { UpcomingEvents } from './UpcomingEvents'

export function Dashboard() {
  const t = useT()
  const { organizer, jury, mentor, participant } = useDashboardHackathonsQuery()

  const organizerHackathons = organizer.data?.hackathons ?? []
  const juryHackathons = jury.data?.hackathons ?? []
  const mentorHackathons = mentor.data?.hackathons ?? []
  const participantHackathons = participant.data?.hackathons ?? []

  const allHackathons = [
    ...organizerHackathons,
    ...juryHackathons,
    ...mentorHackathons,
    ...participantHackathons,
  ]

  return (
    <PageContainer>
      <div className="flex flex-col gap-m8">
        <QuickActions />

        <UpcomingEvents hackathons={allHackathons} />

        <div className="flex flex-col gap-m8">
          <HackathonRoleSection
            title={t('dashboard.sections.participant')}
            hackathons={participantHackathons}
            isLoading={participant.isLoading}
            error={participant.error}
            emptyMessage={t('dashboard.empty.participant')}
            emptyActionLabel={t('dashboard.empty.participant_action')}
            emptyActionHref={routes.hackathons.list}
          />

          <HackathonRoleSection
            title={t('dashboard.sections.mentor')}
            hackathons={mentorHackathons}
            isLoading={mentor.isLoading}
            error={mentor.error}
            emptyMessage={t('dashboard.empty.mentor')}
            emptyHint={t('dashboard.empty.mentor_hint')}
          />

          <HackathonRoleSection
            title={t('dashboard.sections.jury')}
            hackathons={juryHackathons}
            isLoading={jury.isLoading}
            error={jury.error}
            emptyMessage={t('dashboard.empty.jury')}
            emptyHint={t('dashboard.empty.jury_hint')}
          />

          <HackathonRoleSection
            title={t('dashboard.sections.organizer')}
            hackathons={organizerHackathons}
            isLoading={organizer.isLoading}
            error={organizer.error}
            emptyMessage={t('dashboard.empty.organizer')}
            emptyActionLabel={t('dashboard.empty.organizer_action')}
            emptyActionHref={routes.hackathons.create}
          />
        </div>
      </div>
    </PageContainer>
  )
}
