'use client'

import { useState } from 'react'
import { PageContainer, SwitchField } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import { useDashboardHackathonsQuery } from '../model/hooks'
import {
  HACKATHON_DETAIL_TAB_JUDGING,
  HACKATHON_DETAIL_TAB_MANAGEMENT,
  HACKATHON_DETAIL_TAB_SUPPORT,
} from '@/features/hackathon-list/ui/HackathonCard'
import { HackathonRoleSection } from './HackathonRoleSection'
import { QuickActions } from './QuickActions'
import { UpcomingEvents } from './UpcomingEvents'

export function Dashboard() {
  const t = useT()
  const [organizerShowDrafts, setOrganizerShowDrafts] = useState(false)
  const { organizer, jury, mentor, participant } = useDashboardHackathonsQuery({
    includeOwnerDrafts: organizerShowDrafts,
  })

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
            participationMode
          />

          <HackathonRoleSection
            title={t('dashboard.sections.mentor')}
            hackathons={mentorHackathons}
            isLoading={mentor.isLoading}
            error={mentor.error}
            emptyMessage={t('dashboard.empty.mentor')}
            emptyHint={t('dashboard.empty.mentor_hint')}
            detailTabId={HACKATHON_DETAIL_TAB_SUPPORT}
          />

          <HackathonRoleSection
            title={t('dashboard.sections.jury')}
            hackathons={juryHackathons}
            isLoading={jury.isLoading}
            error={jury.error}
            emptyMessage={t('dashboard.empty.jury')}
            emptyHint={t('dashboard.empty.jury_hint')}
            detailTabId={HACKATHON_DETAIL_TAB_JUDGING}
          />

          <HackathonRoleSection
            title={t('dashboard.sections.organizer')}
            hackathons={organizerHackathons}
            isLoading={organizer.isLoading}
            error={organizer.error}
            emptyMessage={t('dashboard.empty.organizer')}
            emptyActionLabel={t('dashboard.empty.organizer_action')}
            emptyActionHref={routes.hackathons.create}
            detailTabId={HACKATHON_DETAIL_TAB_MANAGEMENT}
            sectionAction={
              <SwitchField
                checked={organizerShowDrafts}
                onChange={setOrganizerShowDrafts}
                label={t('dashboard.organizer.show_drafts')}
              />
            }
          />
        </div>
      </div>
    </PageContainer>
  )
}
