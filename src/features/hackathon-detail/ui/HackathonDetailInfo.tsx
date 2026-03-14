'use client'

import { Chip, Icon, IconText, InfoRow, Section, Timeline, MarkdownContent, type TimelineStage } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { getStageProgress, getStageLabel } from '@/entities/hackathon/model/utils'
import { formatDateRange, formatLocation } from '@/shared/lib/formatDate'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'
import type { Hackathon } from '@/entities/hackathon/model/types'

export interface HackathonDetailInfoProps {
  hackathon: Hackathon
}

const STAGE_ORDER: HackathonStage[] = [
  'UPCOMING',
  'REGISTRATION',
  'PRESTART',
  'RUNNING',
  'JUDGING',
  'FINISHED',
]

function buildTimelineStages(
  currentStage: HackathonStage,
  dates: Hackathon['dates'],
  t: ReturnType<typeof useT>
): TimelineStage[] {
  const currentProgress = getStageProgress(currentStage)

  const formatShortDate = (dateStr: string | undefined) => {
    if (!dateStr) return undefined
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('ru', { day: 'numeric', month: 'numeric' })
    } catch {
      return undefined
    }
  }

  const stageDateMap: Record<
    HackathonStage,
    { startDate?: string; endDate?: string }
  > = {
    DRAFT: {},
    UPCOMING: {},
    REGISTRATION: {
      startDate: formatShortDate(dates?.registrationOpensAt),
    },
    PRESTART: {
      startDate: formatShortDate(dates?.registrationClosesAt),
    },
    RUNNING: {
      startDate: formatShortDate(dates?.startsAt),
    },
    JUDGING: {
      startDate: formatShortDate(dates?.endsAt),
    },
    FINISHED: {
      startDate: formatShortDate(dates?.judgingEndsAt),
    },
  }

  return STAGE_ORDER.map(stage => {
    const stageProgress = getStageProgress(stage)
    const stageLabel = getStageLabel(stage)

    let status: 'completed' | 'current' | 'upcoming'
    if (stageProgress < currentProgress) {
      status = 'completed'
    } else if (stageProgress === currentProgress) {
      status = 'current'
    } else {
      status = 'upcoming'
    }

    return {
      label: t(`hackathons.stage.${stageLabel}` as any),
      startDate: stageDateMap[stage].startDate,
      endDate: stageDateMap[stage].endDate,
      status,
    }
  })
}

export function HackathonDetailInfo({ hackathon }: HackathonDetailInfoProps) {
  const t = useT()
  const location = formatLocation(hackathon.location)
  const timelineStages = buildTimelineStages(hackathon.stage, hackathon.dates, t)

  const getFormatLabel = () => {
    if (!hackathon.registrationPolicy) {
      return null
    }
    const { allowIndividual, allowTeam } = hackathon.registrationPolicy
    if (allowTeam && allowIndividual) {
      return t('hackathons.detail.info.format_both')
    }
    if (allowTeam) {
      return t('hackathons.detail.info.format_team')
    }
    if (allowIndividual) {
      return t('hackathons.detail.info.format_individual')
    }
    return null
  }

  const formatLabel = getFormatLabel()
  const hasLinks = hackathon.links && hackathon.links.length > 0

  const hasDates =
    hackathon.dates?.startsAt ||
    hackathon.dates?.registrationOpensAt ||
    hackathon.dates?.submissionsOpensAt ||
    hackathon.dates?.judgingEndsAt

  const hasLimits = hackathon.limits?.teamSizeMax || formatLabel

  return (
    <div className="flex flex-col gap-m8">
      {/* Timeline */}
      <Section>
        <Timeline stages={timelineStages} />
      </Section>

      {/* Основная информация */}
      <Section title={t('hackathons.detail.info.title')}>
        <div className="flex flex-col gap-m6">
          {location && (
            <IconText
              icon={<Icon src="/icons/icon-location/icon-location-md.svg" size="md" />}
              text={location}
            />
          )}
          {formatLabel && (
            <IconText
              icon={<Icon src="/icons/icon-team/iton-team-md.svg" size="md" />}
              text={formatLabel}
            />
          )}
        </div>
      </Section>

      <div className="flex gap-m8">
        {/* Даты */}
        {hasDates && (
          <Section title={t('hackathons.detail.info.dates')} className="flex-1">
            <div className="flex flex-col gap-m6">
              {hackathon.dates?.startsAt && hackathon.dates?.endsAt && (
                <InfoRow
                  label={t('hackathons.stage.running')}
                  value={formatDateRange(hackathon.dates.startsAt, hackathon.dates.endsAt)}
                />
              )}
              {hackathon.dates?.registrationOpensAt && hackathon.dates?.registrationClosesAt && (
                <InfoRow
                  label={t('hackathons.stage.registration')}
                  value={formatDateRange(
                    hackathon.dates.registrationOpensAt,
                    hackathon.dates.registrationClosesAt
                  )}
                />
              )}
              {hackathon.dates?.submissionsOpensAt && hackathon.dates?.submissionsClosesAt && (
                <InfoRow
                  label={t('hackathons.detail.info.submission')}
                  value={formatDateRange(
                    hackathon.dates.submissionsOpensAt,
                    hackathon.dates.submissionsClosesAt
                  )}
                />
              )}
              {hackathon.dates?.judgingEndsAt && (
                <InfoRow
                  label={t('hackathons.stage.judging')}
                  value={new Date(hackathon.dates.judgingEndsAt).toLocaleDateString('ru', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                />
              )}
            </div>
          </Section>
        )}

        {/* Ограничения */}
        {hasLimits && (
          <Section title={t('hackathons.detail.info.limits')} className="flex-1">
            <div className="flex flex-col gap-m6">
              {formatLabel && (
                <InfoRow label={t('hackathons.detail.info.format')} value={formatLabel} />
              )}
              {hackathon.limits?.teamSizeMax && (
                <InfoRow
                  label={t('hackathons.detail.info.team_size')}
                  value={t('hackathons.card.teamSize', { count: hackathon.limits.teamSizeMax })}
                />
              )}
            </div>
          </Section>
        )}

        {/* Ссылки */}
        {hasLinks && (
          <Section title={t('hackathons.detail.info.links')} className="flex-1">
            <div className="flex flex-wrap gap-m4">
              {hackathon.links?.map((link, index) => (
                <Chip
                  key={`${link.url}-${index}`}
                  label={link.title}
                  href={link.url}
                  icon={<Icon src="/icons/icon-link/icon-link-sm.svg" size="sm" />}
                />
              ))}
            </div>
          </Section>
        )}
      </div>
      {/* Description */}
      {hackathon.description && (
        <Section title={t('hackathons.detail.info.description')}>
          <MarkdownContent>{hackathon.description}</MarkdownContent>
        </Section>
      )}
    </div>
  )
}
