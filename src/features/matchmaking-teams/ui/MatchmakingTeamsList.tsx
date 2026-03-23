'use client'

import { useState } from 'react'
import { Button, ListItem, Section } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useMatchmakingTeamsQuery, useTeamQuery } from '@/entities/team/model/hooks'
import { JoinRequestModal } from '@/features/team-join'
import type { components } from '@/shared/api/platform.schema'

type TeamRecommendation = components['schemas']['v1TeamRecommendation']

export interface MatchmakingTeamsListProps {
  hackathonId: string
}

export function MatchmakingTeamsList({ hackathonId }: MatchmakingTeamsListProps) {
  const t = useT()
  const { data, isLoading, error } = useMatchmakingTeamsQuery(hackathonId)
  const [modalTeamId, setModalTeamId] = useState<string | null>(null)
  const [bestVacancyId, setBestVacancyId] = useState<string | null>(null)

  const { data: modalTeamData } = useTeamQuery(hackathonId, modalTeamId, {
    enabled: Boolean(modalTeamId && modalTeamId.length > 0),
  })

  const recommendations = data?.recommendations ?? []
  const modalVacancies = modalTeamData?.team?.vacancies ?? []

  const handleOpenRequest = (rec: TeamRecommendation) => {
    if (!rec.teamId) return
    setModalTeamId(rec.teamId)
    setBestVacancyId(rec.bestVacancyId ?? null)
  }

  const handleCloseModal = () => {
    setModalTeamId(null)
    setBestVacancyId(null)
  }

  if (isLoading) {
    return (
      <p className="typography-body-sm text-text-secondary">{t('hackathons.detail.matchmaking.loading')}</p>
    )
  }

  if (error) {
    return (
      <p className="typography-body-sm text-state-error">{t('hackathons.detail.matchmaking.error')}</p>
    )
  }

  if (recommendations.length === 0) {
    return (
      <p className="typography-body-sm text-text-secondary">{t('hackathons.detail.matchmaking.empty')}</p>
    )
  }

  return (
    <>
      <Section title={t('hackathons.detail.matchmaking.title')} variant="elevated">
        <div className="flex flex-col gap-m4">
          {recommendations.map(rec => (
            <MatchmakingTeamRow
              key={rec.teamId ?? ''}
              hackathonId={hackathonId}
              recommendation={rec}
              onRequestJoin={() => handleOpenRequest(rec)}
            />
          ))}
        </div>
      </Section>

      {modalTeamId && (
        <JoinRequestModal
          open
          onClose={handleCloseModal}
          hackathonId={hackathonId}
          teamId={modalTeamId}
          vacancies={modalVacancies}
          initialVacancyId={bestVacancyId}
        />
      )}
    </>
  )
}

function MatchmakingTeamRow({
  hackathonId,
  recommendation,
  onRequestJoin,
}: {
  hackathonId: string
  recommendation: TeamRecommendation
  onRequestJoin: () => void
}) {
  const t = useT()
  const teamId = recommendation.teamId
  const { data, isLoading } = useTeamQuery(hackathonId, teamId, {
    enabled: Boolean(teamId),
  })

  const teamName = data?.team?.team?.name?.trim() || teamId || '—'
  const score = recommendation.matchScore?.totalScore
  const scoreLabel =
    score != null ? t('hackathons.detail.matchmaking.matchScore', { score: score.toFixed(1) }) : null

  return (
    <ListItem
      variant="bordered"
      text={isLoading ? t('teams.list.loading') : teamName}
      subtitle={scoreLabel ?? undefined}
      rightContent={
        <Button variant="secondary" size="sm" onClick={onRequestJoin} disabled={!teamId}>
          {t('teams.join.submit')}
        </Button>
      }
    />
  )
}
