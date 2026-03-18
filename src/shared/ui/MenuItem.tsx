import Link from 'next/link'
import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'

export type MenuItemProps = {
  href?: string
  onClick?: () => void
  iconSrc: string
  title: string
  active?: boolean
  collapsed?: boolean
  className?: string
  badge?: number
}

export function MenuItem({
  href,
  onClick,
  iconSrc,
  title,
  active = false,
  collapsed = false,
  className,
  badge,
}: MenuItemProps) {
  const base = cn(
    'select-none relative',
    'transition-colors duration-150 ease-out motion-reduce:transition-none',
    active ? 'bg-bg-selected' : 'bg-transparent hover:bg-bg-hover',
    collapsed
      ? 'w-[56px] h-m24 flex items-center justify-center rounded-[var(--spacing-m4)]'
      : 'w-full h-m24 flex items-center p-m8 rounded-md',
    className
  )

  const iconColor = 'primary' as const

  const content = (
    <>
      {collapsed ? (
        <Icon src={iconSrc} size="md" color={iconColor} />
      ) : (
        <div className="flex items-center">
          <Icon src={iconSrc} size="md" color={iconColor} />
          <span className="ml-m8 text-text-tertiary typography-label-sm-medium">/</span>
          <span className="ml-m typography-label-md-medium text-text-primary lowercase">
            {title}
          </span>
        </div>
      )}
      {badge != null && badge > 0 && (
        <span
          className={cn(
            'absolute min-w-[20px] h-[20px] px-m4 flex items-center justify-center rounded-full bg-brand-primary text-text-primary typography-caption-xs animate-in fade-in zoom-in-95 duration-150',
            collapsed
              ? 'top-[calc(50%+8px)] -translate-y-1/2 right-m2'
              : 'top-1/2 -translate-y-1/2 right-m6'
          )}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={base} aria-current={active ? 'page' : undefined}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={base}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {content}
    </button>
  )
}
