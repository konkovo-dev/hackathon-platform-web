import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface ChipListProps {
  children: ReactNode
  className?: string
}

export function ChipList({ children, className }: ChipListProps) {
  return (
    <div className={cn('flex flex-wrap gap-m4', className)}>
      {children}
    </div>
  )
}
