'use client'

import { useMyParticipationQuery } from '@/entities/hackathon-context/model/hooks'
import { useTeamQuery } from '@/entities/team/model/hooks'
import type { Hackathon } from '@/entities/hackathon/model/types'
import {
  HackathonCard,
  HACKATHON_CARD_METRICS_VARIANT,
  HACKATHON_DETAIL_TAB_PARTICIPATION,
} from './HackathonCard'

export interface HackathonCardWithParticipationProps {
  hackathon: Hackathon
  variant?: 'elevated' | 'bordered'
}

export function HackathonCardWithParticipation({
  hackathon,
  variant = 'elevated',
}: HackathonCardWithParticipationProps) {
  const hackathonId = hackathon.hackathonId ?? ''
  const { data: participation } = useMyParticipationQuery(hackathonId)
  const status = participation?.status ?? null
  const teamId = participation?.teamId ?? null

  const needsTeamName =
    status === 'PART_TEAM_MEMBER' || status === 'PART_TEAM_CAPTAIN' ? teamId : null

  const { data: teamData, isLoading: isTeamNameLoading } = useTeamQuery(
    hackathonId,
    needsTeamName,
    {
      enabled: Boolean(hackathonId && needsTeamName),
    }
  )

  const teamName = needsTeamName != null ? (teamData?.team?.team?.name ?? null) : null

  const teamNameLoading = Boolean(needsTeamName && isTeamNameLoading)

  return (
    <HackathonCard
      hackathon={hackathon}
      variant={variant}
      metricsVariant={HACKATHON_CARD_METRICS_VARIANT.participant}
      participationStatus={status}
      teamName={teamName}
      teamNameLoading={teamNameLoading}
      detailTabId={HACKATHON_DETAIL_TAB_PARTICIPATION}
    />
  )
}
