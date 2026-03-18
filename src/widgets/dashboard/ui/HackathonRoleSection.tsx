'use client'

import Link from 'next/link'
import { Section, Button } from '@/shared/ui'
import { HackathonCard } from '@/features/hackathon-list/ui/HackathonCard'
import { HorizontalScrollList } from './HorizontalScrollList'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import type { Hackathon } from '@/entities/hackathon/model/types'

export interface HackathonRoleSectionProps {
  title: string
  hackathons: Hackathon[]
  isLoading: boolean
  error: Error | null
  emptyMessage: string
  emptyHint?: string
  emptyActionLabel?: string
  emptyActionHref?: string
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
}: HackathonRoleSectionProps) {
  const t = useT()

  if (isLoading) {
    return (
      <Section title={title}>
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
      <Section title={title}>
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
      <Section title={title}>
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
    <Section title={title}>
      <HorizontalScrollList>
        {hackathons.map(hackathon => (
          <div key={hackathon.hackathonId} className="flex-shrink-0 snap-start">
            <HackathonCard hackathon={hackathon} variant="bordered" />
          </div>
        ))}
      </HorizontalScrollList>
    </Section>
  )
}
