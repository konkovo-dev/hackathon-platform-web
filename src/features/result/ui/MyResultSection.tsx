'use client'

import { Section, InfoRow, ListItem } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useMyEvaluationResultQuery } from '../model/hooks'

export interface MyResultSectionProps {
  hackathonId: string
}

export function MyResultSection({ hackathonId }: MyResultSectionProps) {
  const t = useT()
  const q = useMyEvaluationResultQuery(hackathonId, true)

  if (q.isLoading) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('hackathons.list.loading')}</p>
      </div>
    )
  }

  if (q.isError) {
    return (
      <Section title={t('hackathons.results.my.title')}>
        <p className="typography-body-md text-text-secondary">{t('hackathons.results.my.loadError')}</p>
      </Section>
    )
  }

  const r = q.data?.result
  if (!r) {
    return (
      <Section title={t('hackathons.results.my.title')}>
        <p className="typography-body-md text-text-secondary">{t('hackathons.results.my.empty')}</p>
      </Section>
    )
  }

  const rank = r.rank != null ? String(r.rank) : '—'
  const score =
    r.averageScore != null && Number.isFinite(r.averageScore)
      ? r.averageScore.toFixed(1)
      : '—'
  const evalCount = r.evaluationCount != null ? String(r.evaluationCount) : '—'

  return (
    <Section title={t('hackathons.results.my.title')}>
      <div className="flex flex-col gap-m6">
        <div className="flex flex-col gap-m4">
          <InfoRow label={t('hackathons.results.my.rank')} value={rank} />
          <InfoRow label={t('hackathons.results.my.score')} value={score} />
          <InfoRow label={t('hackathons.results.my.evaluations')} value={evalCount} />
        </div>
        {r.comments != null && r.comments.length > 0 ? (
          <div className="flex flex-col gap-m3">
            <p className="typography-body-md-regular text-text-primary">{t('hackathons.results.my.comments')}</p>
            <div className="flex flex-col gap-m2">
              {r.comments.map((c, i) => (
                <ListItem key={i} text={c} variant="bordered" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  )
}
