import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Checkbox } from './Checkbox'

export interface ListItemProps {
  text: string
  subtitle?: string
  caption?: string
  selectable?: boolean
  selected?: boolean
  onClick?: () => void
  rightContent?: ReactNode
  leftContent?: ReactNode
  variant?: 'default' | 'bordered' | 'section'
  className?: string
}

export function ListItem({
  text,
  subtitle,
  caption,
  selectable = false,
  selected = false,
  onClick,
  rightContent,
  leftContent,
  variant = 'default',
  className,
}: ListItemProps) {
  const isClickable = !!onClick
  const isBordered = variant === 'bordered'
  const isSection = variant === 'section'
  const hasSubtitle = !!subtitle

  return (
    <div
      role={selectable ? 'option' : isClickable ? 'button' : undefined}
      aria-selected={selectable && selected ? true : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-m8',
        isBordered && [
          'border rounded-[var(--spacing-m2)] px-m4 py-m4',
          'border-border-default',
          'transition-colors',
          isClickable && 'cursor-pointer hover:border-border-strong',
        ],
        isSection && [
          'rounded-[var(--spacing-m4)] px-m6 py-m4',
          'bg-bg-elevated',
          'transition-all duration-300 ease-out',
          isClickable && 'cursor-pointer hover:bg-bg-hover hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1',
        ],
        !isBordered && !isSection && [
          'border-b border-border-default py-m6',
          'transition-colors',
          isClickable && 'cursor-pointer hover:bg-surface-secondary',
        ],
        className
      )}
    >
      {leftContent && <div className="flex-shrink-0">{leftContent}</div>}
      
      <div className="flex-1 min-w-0">
        <div className="typography-body-md-regular text-text-primary">
          {text}
        </div>
        {hasSubtitle && (
          <div className="typography-body-sm-regular text-text-secondary mt-m1">
            {subtitle}
          </div>
        )}
      </div>
      
      {selectable ? (
        <Checkbox checked={selected} readOnly className="pointer-events-none" />
      ) : rightContent ? (
        rightContent
      ) : caption ? (
        <span className="typography-caption-sm-regular text-text-secondary whitespace-nowrap">
          {caption}
        </span>
      ) : null}
    </div>
  )
}
