import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'

export interface ChipProps {
  label?: string
  variant?: 'primary' | 'secondary'
  icon?: ReactNode
  onRemove?: () => void
  onClick?: () => void
  href?: string
  className?: string
}

export function Chip({ label = '', variant = 'primary', icon, onRemove, onClick, href, className }: ChipProps) {
  const isInteractive = Boolean(href || onClick)

  const baseClass = cn(
    'inline-flex items-center gap-m4 h-m16 px-m6 rounded-full transition-all duration-150',
    'animate-in fade-in zoom-in-95 duration-150',
    variant === 'primary' && [
      'bg-brand-primary',
      isInteractive && 'hover:bg-brand-primary-hover active:bg-brand-primary-active cursor-pointer',
    ],
    variant === 'secondary' && [
      'bg-transparent border border-border-strong',
      isInteractive && 'hover:border-border-focus active:border-border-focus cursor-pointer',
    ],
    className
  )

  const content = (
    <>
      {icon && <span className="flex-shrink-0 w-m8 h-m8 flex items-center justify-center">{icon}</span>}
      {label && (
        <span className={cn(
          'typography-caption-sm-medium',
          variant === 'primary' ? 'text-text-primary' : 'text-text-secondary'
        )}>
          {label}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="flex-shrink-0 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
          aria-label="remove"
        >
          <Icon src="/icons/icon-cross/icon-cross-xs.svg" size="xs" color={variant === 'primary' ? 'primary' : 'secondary'} />
        </button>
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {content}
      </a>
    )
  }

  return (
    <div
      className={baseClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick()
            }
          : undefined
      }
    >
      {content}
    </div>
  )
}
