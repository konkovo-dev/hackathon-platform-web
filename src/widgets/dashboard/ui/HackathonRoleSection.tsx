'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Section, Button } from '@/shared/ui'
import { HackathonCard } from '@/features/hackathon-list/ui/HackathonCard'
import { HackathonCardWithParticipation } from '@/features/hackathon-list/ui/HackathonCardWithParticipation'
import { HorizontalScrollList } from './HorizontalScrollList'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import type { Hackathon } from '@/entities/hackathon/model/types'
import type { HackathonDetailTabId } from '@/features/hackathon-list/ui/HackathonCard'

export interface HackathonRoleSectionProps {
  title: string
  hackathons: Hackathon[]
  isLoading: boolean
  error: Error | null
  emptyMessage: string
  emptyHint?: string
  emptyActionLabel?: string
  emptyActionHref?: string
  participationMode?: boolean
  detailTabId?: HackathonDetailTabId | null
  sectionAction?: ReactNode
}

export function HackathonRoleSection({
  title,
  hackathons,
  isLoading,
  error,
  emptyMessage,
  emptyHint,
  emptyActionLabel,
  emptyActionHref,
  participationMode = false,
  detailTabId,
  sectionAction,
}: HackathonRoleSectionProps) {
  const t = useT()

  if (isLoading) {
    return (
      <Section title={title} action={sectionAction}>
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
      <Section title={title} action={sectionAction}>
        <div className="flex flex-col items-center justify-center p-m20 gap-m4">
          <span className="typography-body-md-regular text-state-error">
            {t('dashboard.error')}
          </span>
        </div>
      </Section>
    )
  }

  if (hackathons.length === 0) {
    return (
      <Section title={title} action={sectionAction}>
        <div className="flex flex-col items-center justify-center p-m20 gap-m6 text-center">
          <span className="typography-body-md-regular text-text-secondary">{emptyMessage}</span>
          {emptyHint && (
            <span className="typography-body-sm-regular text-text-tertiary">{emptyHint}</span>
          )}
          {emptyActionLabel && emptyActionHref && (
            <Link href={emptyActionHref}>
              <Button variant="secondary" size="md">
                {emptyActionLabel}
              </Button>
            </Link>
          )}
        </div>
      </Section>
    )
  }

  return (
    <Section title={title} action={sectionAction}>
      <HorizontalScrollList>
        {hackathons.map(hackathon => (
          <div key={hackathon.hackathonId} className="flex-shrink-0 snap-start">
            {participationMode ? (
              <HackathonCardWithParticipation hackathon={hackathon} variant="bordered" />
            ) : (
              <HackathonCard
                hackathon={hackathon}
                variant="bordered"
                detailTabId={detailTabId ?? null}
              />
            )}
          </div>
        ))}
      </HorizontalScrollList>
    </Section>
  )
}
