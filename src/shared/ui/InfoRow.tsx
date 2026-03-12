import { cn } from '@/shared/lib/cn'

export interface InfoRowProps {
  label: string
  value: string
  className?: string
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-m8', className)}>
      <span className="typography-body-md-regular text-text-secondary text-left">{label}</span>
      <span className="typography-body-md-regular text-text-primary text-right">{value}</span>
    </div>
  )
}
