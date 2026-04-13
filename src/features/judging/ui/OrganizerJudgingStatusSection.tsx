'use client'

import { Section, ListItem, Button, Icon } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useJudgingLeaderboardQuery } from '../model/hooks'
import { cn } from '@/shared/lib/cn'
import type { LeaderboardEntry } from '@/entities/judging/api/getLeaderboard'

const MIN_EVALUATIONS_COMPLETE = 3

interface Props {
  hackathonId: string
}

function formatAverage(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })
}

function isTeamOwnerKind(kind: string | undefined): boolean {
  if (!kind) return false
  if (kind === 'OWNER_KIND_TEAM') return true
  return kind.toLowerCase() === 'team'
}

export function OrganizerJudgingStatusSection({ hackathonId }: Props) {
  const t = useT()
  const { data, isLoading, isError, isFetching, refetch } = useJudgingLeaderboardQuery(hackathonId)

  const entries = data?.entries ?? []
  const totalEvaluations = entries.reduce((s, e) => s + (e.evaluationCount ?? 0), 0)

  const sectionTitle =
    isLoading || isError
      ? t('hackathons.management.judging_progress.title')
      : t('hackathons.management.judging_progress.title_with_counts', {
          submissions: entries.length,
          evaluations: totalEvaluations,
        })

  return (
    <Section
      title={sectionTitle}
      variant="elevated"
      action={
        <Button
          variant="icon-secondary"
          size="xs"
          type="button"
          disabled={isFetching}
          onClick={() => refetch()}
          aria-label={t('hackathons.management.judging_progress.refresh')}
        >
          <Icon src="/icons/icon-update/icon-update-xs.svg" size="xs" color="secondary" />
        </Button>
      }
    >
      {isLoading ? (
        <p className="typography-body-sm text-text-secondary">{t('hackathons.list.loading')}</p>
      ) : isError ? (
        <p className="typography-body-sm text-state-error">
          {t('hackathons.management.judging_progress.error')}
        </p>
      ) : entries.length === 0 ? (
        <p className="typography-body-sm text-text-secondary">
          {t('hackathons.management.judging_progress.empty')}
        </p>
      ) : (
        <div className="flex flex-col gap-m3 max-h-[min(60vh,32rem)] overflow-y-auto">
          {entries.map((entry, idx) => (
            <LeaderboardRow key={entry.submissionId ?? `lb-${idx}`} entry={entry} rank={entry.rank ?? idx + 1} />
          ))}
        </div>
      )}
    </Section>
  )
}

function LeaderboardRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const t = useT()
  const title =
    entry.title?.trim() || t('hackathons.management.judging_progress.row_unknown_title')
  const ownerLabel = isTeamOwnerKind(entry.ownerKind)
    ? t('hackathons.judging.owner.team')
    : t('hackathons.judging.owner.individual')
  const evaluations = entry.evaluationCount ?? 0
  const sufficient = evaluations >= MIN_EVALUATIONS_COMPLETE
  const subtitle = t('hackathons.management.judging_progress.row_subtitle', {
    owner: ownerLabel,
    evaluations,
    average: formatAverage(entry.averageScore),
  })

  return (
    <ListItem
      variant="bordered"
      className="min-w-0"
      text={`${rank}. ${title}`}
      textClassName="truncate"
      subtitle={subtitle}
      rightContent={
        <span
          className={cn(
            'typography-caption-sm-regular px-m3 py-m1 rounded-full shrink-0',
            sufficient
              ? 'bg-state-success/15 text-state-success'
              : 'bg-state-warning/15 text-state-warning'
          )}
        >
          {sufficient
            ? t('hackathons.management.judging_progress.badge_complete')
            : t('hackathons.management.judging_progress.badge_partial')}
        </span>
      }
    />
  )
}
