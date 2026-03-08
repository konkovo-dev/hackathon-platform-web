import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface IconTextProps {
  icon: ReactNode
  text: string
  className?: string
}

export function IconText({ icon, text, className }: IconTextProps) {
  return (
    <div className={cn('flex items-center gap-m6', className)}>
      <span className="flex-shrink-0 flex items-center justify-center size-m12">{icon}</span>
      <span className="typography-body-md-regular text-text-primary">{text}</span>
    </div>
  )
}
