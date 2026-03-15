import { cn } from '@/shared/lib/cn'

export type LogoSize = 'lg' | 'md' | 'sm'

const sizeClasses: Record<LogoSize, string> = {
  lg: 'typography-display-xl',
  md: 'typography-heading-sm',
  sm: 'typography-heading-sm',
}

const getText = (size: LogoSize) => {
  if (size === 'sm') return { main: 'h', separator: ':', secondary: '' }
  return { main: 'hack', separator: ':', secondary: 'platform' }
}

export function Logo({ size = 'md', className }: { size?: LogoSize; className?: string }) {
  const text = getText(size)
  const ariaLabel = size === 'sm' ? 'h:' : 'hack:platform'

  return (
    <div className={cn(sizeClasses[size], className)} aria-label={ariaLabel}>
      <span className="text-text-primary">{text.main}</span>
      <span className="text-brand-primary">{text.separator}</span>
      {text.secondary && <span className="text-text-secondary">{text.secondary}</span>}
    </div>
  )
}
