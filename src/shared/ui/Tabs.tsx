import Link from 'next/link'
import { cn } from '@/shared/lib/cn'

export interface Tab<T extends string = string> {
  id: T
  label: string
  href?: string
}

export interface TabsProps<T extends string = string> {
  tabs: Tab<T>[]
  activeTab: T
  onChange: (tabId: T) => void
  className?: string
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--color-bg-default))]'

const tabTriggerClassName = (isActive: boolean) =>
  cn(
    'relative whitespace-nowrap border-b-2 px-m8 pb-m3 typography-label-md transition-colors duration-150 ease-out text-left no-underline',
    '-mb-px',
    focusRing,
    isActive
      ? 'z-[1] border-brand-primary text-text-primary'
      : 'border-transparent text-text-secondary hover:text-text-primary'
  )

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end gap-x-m4 gap-y-m3 border-b border-border-default',
        className
      )}
      role="tablist"
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        const triggerClass = tabTriggerClassName(isActive)

        if (tab.href != null) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={triggerClass}
            >
              {tab.label}
            </Link>
          )
        }
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={triggerClass}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
