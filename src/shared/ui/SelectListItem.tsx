import { cn } from '@/shared/lib/cn'
import { Checkbox } from './Checkbox'

export interface SelectListItemProps {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function SelectListItem({ label, selected, onClick, className }: SelectListItemProps) {
  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        'flex items-center justify-between',
        'border rounded-[var(--spacing-m2)] px-m4 py-m4',
        'cursor-pointer transition-colors',
        'border-border-default hover:border-border-strong',
        className
      )}
    >
      <span className="typography-body-md-regular text-text-primary">{label}</span>
      <Checkbox checked={selected} readOnly className="pointer-events-none" />
    </div>
  )
}
