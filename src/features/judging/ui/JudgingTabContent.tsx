'use client'

import { useState } from 'react'
import { Chip, ChipList } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useLocale } from '@/shared/i18n/useLocale'
import type { HackathonStage } from '@/entities/hackathon-context/model/types'
import { formatDateTime } from '@/shared/lib/formatDate'
import { useMyAssignmentsQuery, useMyEvaluationsQuery } from '../model/hooks'
import { AssignmentList } from './AssignmentList'
import type { AssignmentWithSubmission } from '@/entities/judging/api/getMyAssignments'

type Filter = 'all' | 'pending' | 'done'

interface Props {
  hackathonId: string
  stage: HackathonStage
  submissionsClosesAt?: string | null
  showJudgeAssignments?: boolean
}

function isJudgingAssignmentsStage(stage: HackathonStage): boolean {
  return stage === 'JUDGING' || stage === 'FINISHED'
}

export function JudgingTabContent({
  hackathonId,
  stage,
  submissionsClosesAt,
  showJudgeAssignments = true,
}: Props) {
  const t = useT()
  const locale = useLocale()
  const [filter, setFilter] = useState<Filter>('all')

  const judgingDataEnabled = isJudgingAssignmentsStage(stage)
  const judgeQueriesEnabled = judgingDataEnabled && showJudgeAssignments

  const { data: assignmentsData, isLoading: isLoadingAssignments } = useMyAssignmentsQuery(
    hackathonId,
    { enabled: judgeQueriesEnabled }
  )
  const { data: evaluationsData, isLoading: isLoadingEvaluations } = useMyEvaluationsQuery(
    hackathonId,
    { enabled: judgeQueriesEnabled }
  )

  const isLoading = judgeQueriesEnabled && (isLoadingAssignments || isLoadingEvaluations)

  const allAssignments: AssignmentWithSubmission[] = assignmentsData?.assignments ?? []
  const evaluations = evaluationsData?.evaluations ?? []

  const filteredAssignments = allAssignments.filter(a => {
    if (filter === 'pending') return a.assignment?.isEvaluated !== true
    if (filter === 'done') return a.assignment?.isEvaluated === true
    return true
  })

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('hackathons.judging.filter.all') },
    { id: 'pending', label: t('hackathons.judging.filter.pending') },
    { id: 'done', label: t('hackathons.judging.filter.done') },
  ]

  if (!judgingDataEnabled) {
    const datetime =
      submissionsClosesAt != null && submissionsClosesAt !== ''
        ? formatDateTime(submissionsClosesAt, locale)
        : ''
    return (
      <p className="typography-body-md text-text-secondary py-m8">
        {datetime
          ? t('hackathons.judging.not_started_with_date', { datetime })
          : t('hackathons.judging.not_started_no_date')}
      </p>
    )
  }

  if (isLoading) {
    return (
      <p className="typography-body-md text-text-secondary py-m8">{t('hackathons.list.loading')}</p>
    )
  }

  return (
    <div className="flex flex-col gap-m8">
      {showJudgeAssignments ? (
        <>
          <ChipList>
            {filters.map(f => (
              <Chip
                key={f.id}
                label={f.label}
                variant={filter === f.id ? 'primary' : 'secondary'}
                onClick={() => setFilter(f.id)}
              />
            ))}
          </ChipList>

          <AssignmentList
            hackathonId={hackathonId}
            assignments={filteredAssignments}
            evaluations={evaluations}
          />
        </>
      ) : null}
    </div>
  )
}
