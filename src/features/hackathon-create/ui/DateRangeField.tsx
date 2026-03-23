'use client'

import { Input } from '@/shared/ui/Input'

interface DateRangeFieldProps {
  startLabel: string
  endLabel: string
  startValue: string
  endValue: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  startId: string
  endId: string
  disabled: boolean
  startError?: boolean
  endError?: boolean
}

export function DateRangeField({
  startLabel,
  endLabel,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startId,
  endId,
  disabled,
  startError,
  endError,
}: DateRangeFieldProps) {
  return (
    <div className="flex items-center gap-m4">
      <span className="typography-label-sm text-text-secondary whitespace-nowrap">
        {startLabel}
      </span>
      <Input
        id={startId}
        type="datetime-local"
        value={startValue}
        onChange={e => onStartChange(e.target.value)}
        disabled={disabled}
        error={startError}
        className="flex-1"
      />
      <span className="typography-label-sm text-text-secondary whitespace-nowrap">{endLabel}</span>
      <Input
        id={endId}
        type="datetime-local"
        value={endValue}
        onChange={e => onEndChange(e.target.value)}
        disabled={disabled}
        error={endError}
        className="flex-1"
      />
    </div>
  )
}
