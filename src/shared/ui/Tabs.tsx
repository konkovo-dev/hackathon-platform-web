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

const tabContent = (activeTab: string, tabId: string, label: string) => (
  <>
    {label}
    {activeTab === tabId ? (
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary animate-in fade-in slide-in-from-bottom-1 duration-200"
        aria-hidden="true"
      />
    ) : (
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-border-default opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-hidden="true"
      />
    )}
  </>
)

const tabClassName = (isActive: boolean) =>
  cn(
    'group typography-label-md pb-m4 px-m8 relative transition-all duration-200 text-left',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
    'rounded-t-[var(--spacing-m2)]',
    isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
  )

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div className={cn('flex gap-m8 border-b border-border-default', className)} role="tablist">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        if (tab.href != null) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={tabClassName(isActive)}
            >
              {tabContent(activeTab, tab.id, tab.label)}
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
            className={tabClassName(isActive)}
          >
            {tabContent(activeTab, tab.id, tab.label)}
          </button>
        )
      })}
    </div>
  )
}
