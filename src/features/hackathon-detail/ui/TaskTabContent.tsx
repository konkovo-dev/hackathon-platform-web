'use client'

import { Section, MarkdownContent } from '@/shared/ui'
import { useT } from '@/shared/i18n/useT'

export interface TaskTabContentProps {
  hackathonId: string
  task: string | undefined
  isLoading: boolean
}

export function TaskTabContent({ task, isLoading }: TaskTabContentProps) {
  const t = useT()

  if (isLoading) {
    return (
      <div className="py-m8">
        <p className="typography-body-md text-text-secondary">
          {t('hackathons.list.loading')}
        </p>
      </div>
    )
  }

  const hasContent = task != null && task.trim().length > 0

  return (
    <div className="flex flex-col gap-m16">
      <Section title={t('hackathons.detail.tabs.task')}>
        {hasContent ? (
          <MarkdownContent>{task}</MarkdownContent>
        ) : (
          <p className="typography-body-md text-text-secondary">
            {t('hackathons.detail.task.empty')}
          </p>
        )}
      </Section>
    </div>
  )
}
