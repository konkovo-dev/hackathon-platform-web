'use client'

import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface HorizontalScrollListProps {
  children: ReactNode
  className?: string
}

export function HorizontalScrollList({ children, className }: HorizontalScrollListProps) {
  return (
    <div
      className={cn(
        'flex gap-m8 overflow-x-auto pb-m4 scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent',
        'snap-x snap-mandatory scroll-smooth',
        className
      )}
      style={{
        scrollbarWidth: 'thin',
      }}
    >
      {children}
    </div>
  )
}
