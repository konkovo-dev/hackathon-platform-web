import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Checkbox } from './Checkbox'

export interface ListItemProps {
  text: string
  caption?: string
  selectable?: boolean
  selected?: boolean
  onClick?: () => void
  rightContent?: ReactNode
  variant?: 'default' | 'bordered'
  className?: string
}

export function ListItem({
  text,
  caption,
  selectable = false,
  selected = false,
  onClick,
  rightContent,
  variant = 'default',
  className,
}: ListItemProps) {
  const isClickable = !!onClick
  const isBordered = variant === 'bordered'

  return (
    <div
      role={selectable ? 'option' : isClickable ? 'button' : undefined}
      aria-selected={selectable && selected ? true : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-m8',
        'transition-colors',
        isBordered && [
          'border rounded-[var(--spacing-m2)] px-m4 py-m4',
          'border-border-default',
          isClickable && 'cursor-pointer hover:border-border-strong',
        ],
        !isBordered && [
          'border-b border-border-default py-m6',
          isClickable && 'cursor-pointer hover:bg-surface-secondary',
        ],
        className
      )}
    >
      <span className="typography-body-md-regular text-text-primary flex-1">{text}</span>
      
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
