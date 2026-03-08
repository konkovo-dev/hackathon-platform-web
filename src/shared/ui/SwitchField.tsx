import { Switch } from './Switch'
import { cn } from '@/shared/lib/cn'

export interface SwitchFieldProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
  className?: string
}

export function SwitchField({ checked, onChange, label, disabled, className }: SwitchFieldProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-m4 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <Switch checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} />
      <span className="typography-caption-sm-regular text-text-secondary">{label}</span>
    </label>
  )
}
