'use client'

import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/cn'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  trackClassName?: string
  thumbClassName?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, disabled, trackClassName, thumbClassName, ...props }, ref) => {
    return (
      <label
        className={cn(
          'relative inline-flex cursor-pointer items-center',
          disabled && 'cursor-not-allowed',
          className
        )}
      >
        <input ref={ref} type="checkbox" disabled={disabled} className="sr-only peer" {...props} />
        <span
          className={cn(
            'relative inline-flex h-m12 w-m20 items-center rounded-full',
            'bg-bg-default',
            'border border-border-strong peer-checked:border-border-focus',
            'transition-all duration-200',
            disabled && 'opacity-50',
            trackClassName
          )}
        />
        <span
          className={cn(
            'pointer-events-none absolute left-[var(--spacing-m2)] top-1/2 h-m8 w-m8 -translate-y-1/2 rounded-full',
            'bg-brand-primary',
            'transition-all duration-200',
            'peer-checked:translate-x-[var(--spacing-m8)]',
            disabled && 'opacity-50',
            thumbClassName
          )}
        />
      </label>
    )
  }
)

Switch.displayName = 'Switch'
