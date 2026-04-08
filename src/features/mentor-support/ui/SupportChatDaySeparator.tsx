'use client'

import { cn } from '@/shared/lib/cn'
import { useI18n } from '@/shared/i18n/useT'
import { formatSupportChatDayLabel } from '../lib/formatSupportChatDayLabel'

export interface SupportChatDaySeparatorProps {
  anchorIso: string
}

export function SupportChatDaySeparator({ anchorIso }: SupportChatDaySeparatorProps) {
  const { locale, t } = useI18n()
  const label = formatSupportChatDayLabel(anchorIso, locale, t)
  if (!label) return null

  return (
    <div className="flex w-full shrink-0 justify-center py-m3">
      <span
        className={cn(
          'rounded-full border border-border-default/80 bg-bg-elevated px-m5 py-m2',
          'typography-caption-sm-regular text-text-tertiary'
        )}
      >
        {label}
      </span>
    </div>
  )
}
