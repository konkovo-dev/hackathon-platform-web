'use client'

import Link from 'next/link'
import { cn } from '@/shared/lib/cn'

export interface HackathonDetailSubnavItem {
  id: string
  label: string
  href: string
}

export interface HackathonDetailSubnavProps {
  ariaLabel: string
  items: HackathonDetailSubnavItem[]
  activeId: string
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg-surface))]'

export function HackathonDetailSubnav({ ariaLabel, items, activeId }: HackathonDetailSubnavProps) {
  if (items.length <= 1) {
    return null
  }

  return (
    <nav
      aria-label={ariaLabel}
      className="w-full min-w-0 shrink-0 rounded-[var(--spacing-m4)] border border-border-default bg-transparent p-m3 transition-colors duration-150 ease-out hover:border-border-strong motion-reduce:transition-none lg:w-[13rem] lg:p-m4"
    >
      <ul
        className={cn(
          'flex flex-wrap items-center gap-m4',
          'lg:flex-col lg:items-stretch lg:gap-y-m4'
        )}
      >
        {items.map(item => {
          const isActive = item.id === activeId
          return (
            <li key={item.id} className="min-w-0 lg:w-full">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'block rounded-[var(--spacing-m4)] px-m4 py-m3 typography-label-md no-underline transition-colors duration-150 ease-out motion-reduce:transition-none',
                  focusRing,
                  isActive
                    ? 'bg-bg-selected font-medium text-text-primary'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
