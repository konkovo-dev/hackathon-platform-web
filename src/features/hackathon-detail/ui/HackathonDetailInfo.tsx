'use client'

import { useState } from 'react'
import {
  Chip,
  Icon,
  IconText,
  InfoRow,
  Section,
  Timeline,
  MarkdownContent,
  Button,
  type TimelineStage,
} from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { getStageProgress, getStageLabel } from '@/entities/hackathon/model/utils'
import { formatDateRangeWithTime, formatDateTime, formatLocation } from '@/shared/lib/formatDate'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'
import type { Hackathon } from '@/entities/hackathon/model/types'
import { useSessionQuery } from '@/features/auth/model/hooks'
import { useCan } from '@/shared/policy/useCan'
import { RegistrationChoiceModal } from '@/features/hackathon-registration'
import { useRegisterForHackathonMutation } from '@/features/hackathon-registration/model/hooks'

export interface HackathonDetailInfoProps {
  hackathonId: string
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

  const stageDateMap: Record<HackathonStage, { startDate?: string; endDate?: string }> = {
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

export function HackathonDetailInfo({ hackathonId, hackathon }: HackathonDetailInfoProps) {
  const t = useT()
  const [registrationChoiceOpen, setRegistrationChoiceOpen] = useState(false)

  const sessionQuery = useSessionQuery()
  const { decision: registerDecision, isLoading: registerPermissionLoading } = useCan(
    'Participation.Register',
    { hackathonId }
  )
  const registerMutation = useRegisterForHackathonMutation(hackathonId)

  const isAuthed = sessionQuery.data?.active === true
  const canRegister = registerDecision.allowed
  const showRegisterButton = isAuthed && (canRegister || registerPermissionLoading)

  const allowIndividual = hackathon.registrationPolicy?.allowIndividual ?? true
  const allowTeam = hackathon.registrationPolicy?.allowTeam ?? true
  const onlyIndividual = allowIndividual && !allowTeam
  const onlyOneOption = onlyIndividual

  const handleRegisterClick = () => {
    if (onlyOneOption) {
      registerMutation
        .mutateAsync({ desiredStatus: 'PART_INDIVIDUAL' })
        .catch(e => console.error('Register failed:', e))
      return
    }
    setRegistrationChoiceOpen(true)
  }

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

  const hasLimits =
    (hackathon.limits?.teamSizeMax && hackathon.limits.teamSizeMax > 0) || formatLabel

  return (
    <div className="flex flex-col gap-m8">
      {/* Timeline */}
      <Section>
        <Timeline stages={timelineStages} />
      </Section>

      {/* Основная информация */}
      <Section title={t('hackathons.detail.info.title')}>
        <div className="flex flex-col gap-m6">
          <h2 className="typography-body-lg-medium text-text-primary">{hackathon.name}</h2>

          {hackathon.shortDescription && (
            <p className="typography-body-md-regular text-text-secondary">
              {hackathon.shortDescription}
            </p>
          )}

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

          {showRegisterButton && (
            <div className="pt-m4">
              <Button
                variant="primary"
                size="md"
                onClick={handleRegisterClick}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? t('teams.list.loading')
                  : t('hackathons.detail.register')}
              </Button>
            </div>
          )}
        </div>
      </Section>

      <RegistrationChoiceModal
        open={registrationChoiceOpen}
        onClose={() => setRegistrationChoiceOpen(false)}
        hackathon={hackathon}
        hackathonId={hackathonId}
      />

      <div className="flex gap-m8">
        {/* Даты */}
        {hasDates && (
          <Section title={t('hackathons.detail.info.dates')} className="flex-1">
            <div className="flex flex-col gap-m6">
              {hackathon.dates?.registrationOpensAt && hackathon.dates?.registrationClosesAt && (
                <InfoRow
                  label={t('hackathons.stage.registration')}
                  value={formatDateRangeWithTime(
                    hackathon.dates.registrationOpensAt,
                    hackathon.dates.registrationClosesAt
                  )}
                />
              )}
              {hackathon.dates?.startsAt && hackathon.dates?.endsAt && (
                <InfoRow
                  label={t('hackathons.stage.running')}
                  value={formatDateRangeWithTime(hackathon.dates.startsAt, hackathon.dates.endsAt)}
                />
              )}
              {hackathon.dates?.submissionsOpensAt && hackathon.dates?.submissionsClosesAt && (
                <InfoRow
                  label={t('hackathons.detail.info.submission')}
                  value={formatDateRangeWithTime(
                    hackathon.dates.submissionsOpensAt,
                    hackathon.dates.submissionsClosesAt
                  )}
                />
              )}
              {hackathon.dates?.judgingEndsAt && (
                <InfoRow
                  label={t('hackathons.stage.judging')}
                  value={formatDateTime(hackathon.dates.judgingEndsAt)}
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
              {hackathon.limits?.teamSizeMax && hackathon.limits.teamSizeMax > 0 && (
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
