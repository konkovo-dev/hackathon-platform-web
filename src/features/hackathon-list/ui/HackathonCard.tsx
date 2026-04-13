'use client'

import { useRouter } from 'next/navigation'
import { Button, Icon, IconCompletion, IconText } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { routes } from '@/shared/config/routes'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { getStageProgress, getStageLabel } from '@/entities/hackathon/model/utils'
import { formatDateRange, formatLocation } from '@/shared/lib/formatDate'
import { cn } from '@/shared/lib/cn'
import { ParticipationBadge } from './ParticipationBadge'
import type { components } from '@/shared/api/platform.schema'

type ParticipationStatus = components['schemas']['v1ParticipationStatus']
export type HackathonCardMetricsVariant = 'catalog' | 'participant'

export const HACKATHON_CARD_METRICS_VARIANT = {
  catalog: 'catalog',
  participant: 'participant',
} as const satisfies Record<HackathonCardMetricsVariant, HackathonCardMetricsVariant>

export const HACKATHON_DETAIL_TAB_PARTICIPATION = 'participation' as const
export const HACKATHON_DETAIL_TAB_JUDGING = 'judging' as const
export const HACKATHON_DETAIL_TAB_MANAGEMENT = 'management' as const
export const HACKATHON_DETAIL_TAB_SUPPORT = 'support' as const

export type HackathonDetailTabId =
  | typeof HACKATHON_DETAIL_TAB_PARTICIPATION
  | typeof HACKATHON_DETAIL_TAB_JUDGING
  | typeof HACKATHON_DETAIL_TAB_MANAGEMENT
  | typeof HACKATHON_DETAIL_TAB_SUPPORT

export interface HackathonCardProps {
  hackathon: Hackathon
  className?: string
  variant?: 'elevated' | 'bordered'
  metricsVariant?: HackathonCardMetricsVariant
  participationStatus?: ParticipationStatus | null
  teamName?: string | null
  teamNameLoading?: boolean
  detailTabId?: HackathonDetailTabId | null
}

export function HackathonCard({
  hackathon,
  className,
  variant = 'elevated',
  metricsVariant = 'catalog',
  participationStatus,
  teamName,
  teamNameLoading,
  detailTabId,
}: HackathonCardProps) {
  const t = useT()
  const router = useRouter()

  const location = formatLocation(hackathon.location)
  const dateRange = formatDateRange(hackathon.dates?.startsAt, hackathon.dates?.endsAt)
  const teamSize = hackathon.limits?.teamSizeMax
    ? t('hackathons.card.teamSize', { count: hackathon.limits.teamSizeMax })
    : null

  const stageProgress = getStageProgress(hackathon.stage)
  const stageLabel = getStageLabel(hackathon.stage)

  const handleNavigate = () => {
    if (!hackathon.hackathonId) return
    router.push(
      detailTabId
        ? routes.hackathons.detailWithTab(hackathon.hackathonId, detailTabId)
        : routes.hackathons.detail(hackathon.hackathonId)
    )
  }

  const isElevated = variant === 'elevated'
  const isBordered = variant === 'bordered'

  const showParticipation =
    metricsVariant === 'participant' &&
    participationStatus &&
    participationStatus !== 'PART_NONE' &&
    participationStatus !== 'PARTICIPATION_STATUS_UNSPECIFIED'

  const showTeamSizeRow = metricsVariant === 'catalog' && teamSize

  return (
    <div
      className={cn(
        'flex flex-col p-m8 w-[258px] h-full',
        'rounded-[var(--spacing-m4)] overflow-hidden',
        'animate-in fade-in zoom-in-95 duration-150',
        'transition-all duration-200 ease-out',
        'cursor-pointer',
        isElevated && [
          'bg-bg-elevated hover:bg-bg-hover',
          'hover:scale-[1.02] hover:-translate-y-1',
          'hover:shadow-[0_8px_24px_-4px_var(--color-shadow-color)]',
        ],
        isBordered && ['border border-border-default hover:border-border-strong'],
        className
      )}
      onClick={handleNavigate}
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

          {showParticipation && (
            <ParticipationBadge
              status={participationStatus}
              teamName={teamName}
              teamNameLoading={teamNameLoading}
            />
          )}

          {showTeamSizeRow && (
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
        onClick={e => {
          e.stopPropagation()
          handleNavigate()
        }}
      >
        {t('hackathons.card.details')}
      </Button>
    </div>
  )
}
