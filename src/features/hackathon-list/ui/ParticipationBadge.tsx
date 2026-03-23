'use client'

import { Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import type { components } from '@/shared/api/platform.schema'

type ParticipationStatus = components['schemas']['v1ParticipationStatus']

export interface ParticipationBadgeProps {
  status: ParticipationStatus
  teamName?: string | null
  teamNameLoading?: boolean
}

export function ParticipationBadge({ status, teamName, teamNameLoading }: ParticipationBadgeProps) {
  const t = useT()

  if (status === 'PART_INDIVIDUAL') {
    return (
      <div className="flex items-center gap-m6">
        <span className="flex-shrink-0 flex items-center justify-center size-m12">
          <Icon src="/icons/icon-team/iton-team-md.svg" size="md" />
        </span>
        <span className="typography-body-md-regular text-text-primary">
          {t('hackathons.card.participation.individual')}
        </span>
      </div>
    )
  }

  if (status === 'PART_LOOKING_FOR_TEAM') {
    return (
      <div className="flex items-center gap-m6">
        <span className="flex-shrink-0 flex items-center justify-center size-m12">
          <Icon src="/icons/icon-search/icon-search-md.svg" size="md" />
        </span>
        <span className="typography-body-md-regular text-text-primary">
          {t('hackathons.card.participation.lookingForTeam')}
        </span>
      </div>
    )
  }

  if (status === 'PART_TEAM_MEMBER' || status === 'PART_TEAM_CAPTAIN') {
    const name = teamName?.trim()
    if (!name) {
      return (
        <div className="flex items-center gap-m6">
          <span className="flex-shrink-0 flex items-center justify-center size-m12">
            <Icon src="/icons/icon-team/iton-team-md.svg" size="md" />
          </span>
          <span className="typography-body-md-regular text-text-secondary">
            {teamNameLoading ? t('teams.list.loading') : t('common.fallback.team')}
          </span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-m6">
        <span className="flex-shrink-0 flex items-center justify-center size-m12">
          <Icon src="/icons/icon-team/iton-team-md.svg" size="md" />
        </span>
        <span className="typography-body-md-regular text-text-primary">
          {t('hackathons.card.participation.team', { name })}
        </span>
      </div>
    )
  }

  return null
}
