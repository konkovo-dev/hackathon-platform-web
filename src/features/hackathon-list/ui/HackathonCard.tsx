'use client'

import { Button, Icon, IconCompletion, IconText } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { getStageProgress, getStageLabel } from '@/entities/hackathon/model/utils'
import { formatDateRange, formatLocation } from '@/shared/lib/formatDate'
import { cn } from '@/shared/lib/cn'

export interface HackathonCardProps {
  hackathon: Hackathon
  className?: string
}

export function HackathonCard({ hackathon, className }: HackathonCardProps) {
  const t = useT()

  const location = formatLocation(hackathon.location)
  const dateRange = formatDateRange(hackathon.dates?.startsAt, hackathon.dates?.endsAt)
  const teamSize = hackathon.limits?.teamSizeMax
    ? t('hackathons.card.teamSize', { count: hackathon.limits.teamSizeMax })
    : null

  const stageProgress = getStageProgress(hackathon.stage)
  const stageLabel = getStageLabel(hackathon.stage)

  return (
    <div
      className={cn(
        'flex flex-col p-m8 w-[258px] h-full',
        'bg-bg-elevated rounded-[var(--spacing-m4)] overflow-hidden',
        'animate-in fade-in zoom-in-95 duration-150',
        className
      )}
    >
      <div className="flex flex-col gap-m8 flex-1">
        <h3 className="typography-title-md text-text-primary">{hackathon.name}</h3>

        <div className="flex flex-col gap-m6">
          {location && (
            <IconText
              icon={<Icon src="/icons/icon-location/icon-location-md.svg" size="md" />}
              text={location}
            />
          )}

          {dateRange && (
            <IconText
              icon={<Icon src="/icons/icon-calendar/icon-calendar-md.svg" size="md" />}
              text={dateRange}
            />
          )}

          {teamSize && (
            <IconText
              icon={<Icon src="/icons/icon-team/iton-team-md.svg" size="md" />}
              text={teamSize}
            />
          )}

          <IconText
            icon={<IconCompletion progress={stageProgress} />}
            text={t(`hackathons.stage.${stageLabel}` as any)}
          />
        </div>
      </div>

      <Button
        variant="action"
        size="lg"
        className="w-full mt-m8"
        onClick={() => {
          window.location.href = `/hackathons/${hackathon.hackathonId}`
        }}
      >
        {t('hackathons.card.details')}
      </Button>
    </div>
  )
}
