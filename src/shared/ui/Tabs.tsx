import { cn } from '@/shared/lib/cn'

export interface Tab<T extends string = string> {
  id: T
  label: string
}

export interface TabsProps<T extends string = string> {
  tabs: Tab<T>[]
  activeTab: T
  onChange: (tabId: T) => void
  className?: string
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div className={cn('flex gap-m8 border-b border-border-default', className)} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          id={`tab-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={cn(
            'group typography-label-md pb-m4 px-m8 relative transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
            'rounded-t-[var(--spacing-m2)]',
            activeTab === tab.id
              ? 'text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {tab.label}
          {activeTab === tab.id ? (
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
        </button>
      ))}
    </div>
  )
}
