'use client'

import Link from 'next/link'
import { Section, Button } from '@/shared/ui'
import {
  HackathonCard,
  HACKATHON_DETAIL_TAB_MANAGEMENT,
} from '@/features/hackathon-list/ui/HackathonCard'
import { HorizontalScrollList } from './HorizontalScrollList'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import type { Hackathon } from '@/entities/hackathon/model/types'

export interface OrganizerSectionProps {
  activeHackathons: Hackathon[]
  draftHackathons: Hackathon[]
  isLoading: boolean
  error: Error | null
}

export function OrganizerSection({
  activeHackathons,
  draftHackathons,
  isLoading,
  error,
}: OrganizerSectionProps) {
  const t = useT()

  if (isLoading) {
    return (
      <Section title={t('dashboard.sections.organizer')}>
        <div className="flex items-center justify-center p-m20">
          <span className="typography-body-md-regular text-text-secondary">
            {t('dashboard.loading')}
          </span>
        </div>
      </Section>
    )
  }

  if (error) {
    return (
      <Section title={t('dashboard.sections.organizer')}>
        <div className="flex flex-col items-center justify-center p-m20 gap-m4">
          <span className="typography-body-md-regular text-state-error">
            {t('dashboard.error')}
          </span>
        </div>
      </Section>
    )
  }

  if (activeHackathons.length === 0 && draftHackathons.length === 0) {
    return (
      <Section title={t('dashboard.sections.organizer')}>
        <div className="flex flex-col items-center justify-center p-m20 gap-m6 text-center">
          <span className="typography-body-md-regular text-text-secondary">
            {t('dashboard.empty.organizer')}
          </span>
          <Link href={routes.hackathons.create}>
            <Button variant="secondary" size="md">
              {t('dashboard.empty.organizer_action')}
            </Button>
          </Link>
        </div>
      </Section>
    )
  }

  return (
    <Section title={t('dashboard.sections.organizer')}>
      <div className="flex flex-col gap-m8">
        {/* Активные хакатоны */}
        {activeHackathons.length > 0 && (
          <div className="flex flex-col gap-m4">
            <h3 className="typography-body-md-medium text-text-primary">
              {t('dashboard.organizer.active')}
            </h3>
            <HorizontalScrollList>
              {activeHackathons.map(hackathon => (
                <div key={hackathon.hackathonId} className="flex-shrink-0 snap-start">
                  <HackathonCard
                    hackathon={hackathon}
                    variant="bordered"
                    detailTabId={HACKATHON_DETAIL_TAB_MANAGEMENT}
                  />
                </div>
              ))}
            </HorizontalScrollList>
          </div>
        )}

        {/* Черновики */}
        {draftHackathons.length > 0 && (
          <div className="flex flex-col gap-m4">
            <h3 className="typography-body-md-medium text-text-primary">
              {t('dashboard.organizer.drafts')}
            </h3>
            <HorizontalScrollList>
              {draftHackathons.map(hackathon => (
                <div key={hackathon.hackathonId} className="flex-shrink-0 snap-start">
                  <HackathonCard
                    hackathon={hackathon}
                    variant="bordered"
                    detailTabId={HACKATHON_DETAIL_TAB_MANAGEMENT}
                  />
                </div>
              ))}
            </HorizontalScrollList>
          </div>
        )}
      </div>
    </Section>
  )
}
