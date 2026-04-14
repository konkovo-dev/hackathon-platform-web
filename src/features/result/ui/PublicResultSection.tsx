'use client'

import { Section, MarkdownContent } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'
import { useHackathonResultQuery } from '../model/hooks'

export interface PublicResultSectionProps {
  hackathonId: string
}

export function PublicResultSection({ hackathonId }: PublicResultSectionProps) {
  const t = useT()
  const resultQuery = useHackathonResultQuery(hackathonId, true)

  if (resultQuery.isLoading) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('hackathons.list.loading')}</p>
      </div>
    )
  }

  if (resultQuery.isError) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">{t('hackathons.results.public.loadError')}</p>
      </div>
    )
  }

  const text = resultQuery.data?.result?.trim() ?? ''
  const hasContent = text.length > 0

  return (
    <div className="flex flex-col gap-m16">
      <Section title={t('hackathons.results.public.title')}>
        {hasContent ? (
          <MarkdownContent>{resultQuery.data?.result ?? ''}</MarkdownContent>
        ) : (
          <p className="typography-body-md text-text-secondary">{t('hackathons.results.public.noResult')}</p>
        )}
      </Section>
    </div>
  )
}
