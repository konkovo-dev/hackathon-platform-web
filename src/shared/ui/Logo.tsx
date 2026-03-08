import { cn } from '@/shared/lib/cn'

export type LogoSize = 'md' | 'sm'

export function Logo({ size = 'md', className }: { size?: LogoSize; className?: string }) {
  return (
    <div
      className={cn('typography-heading-sm', className)}
      aria-label={size === 'sm' ? 'h:' : 'hack:platform'}
    >
      <span className="text-text-primary">{size === 'sm' ? 'h' : 'hack'}</span>
      <span className="text-brand-primary">:</span>
      {size === 'md' && <span className="text-text-secondary">platform</span>}
    </div>
  )
}
