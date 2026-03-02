import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface SelectListProps {
  children: ReactNode
  className?: string
}

export function SelectList({ children, className }: SelectListProps) {
  return (
    <div
      role="listbox"
      className={cn('flex flex-col gap-m4 rounded-[var(--spacing-m2)] pb-m4', className)}
    >
      {children}
    </div>
  )
}
