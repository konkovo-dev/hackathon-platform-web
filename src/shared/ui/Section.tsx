import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface SectionProps {
  title?: string
  action?: ReactNode
  hoverAction?: ReactNode
  children: ReactNode
  className?: string
  variant?: 'elevated' | 'outlined'
}

export function Section({ title, action, hoverAction, children, className, variant = 'elevated' }: SectionProps) {
  const isElevated = variant === 'elevated'
  const isOutlined = variant === 'outlined'

  return (
    <div
      className={cn(
        'relative group rounded-[var(--spacing-m4)] px-m8 pb-m10 flex flex-col gap-m8',
        'animate-in fade-in slide-in-from-bottom-2 duration-200',
        'transition-all duration-300 ease-out',
        isElevated && 'bg-bg-elevated hover:bg-bg-hover hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1',
        isOutlined && 'border border-border-default hover:border-border-strong',
        title ? 'pt-m6' : 'pt-m10',
        className
      )}
    >
      {action && (
        <div className="absolute top-m4 right-m4 flex items-center gap-m2 animate-in fade-in zoom-in-95 duration-150">
          {action}
        </div>
      )}
      {!action && hoverAction && (
        <div className="absolute top-m4 right-m4 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {hoverAction}
        </div>
      )}
      {title && <span className="typography-body-sm-regular text-text-secondary">{title}</span>}
      {children}
    </div>
  )
}
