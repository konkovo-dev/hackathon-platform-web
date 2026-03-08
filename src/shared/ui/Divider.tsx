import { cn } from '@/shared/lib/cn'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <div
      className={cn(
        'bg-border-default',
        orientation === 'horizontal' && 'h-px w-full',
        orientation === 'vertical' && 'w-px h-m8',
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  )
}
