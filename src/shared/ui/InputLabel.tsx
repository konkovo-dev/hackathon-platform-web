import { cn } from '@/shared/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'
import { Input } from './Input'
import type { InputProps } from './Input'
import { Label } from './Label'

export interface InputLabelProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  inputPlaceholder?: string
  inputId?: string
  inputType?: string
  error?: boolean
  inputProps?: Omit<InputProps, 'id' | 'placeholder' | 'type' | 'error' | 'className'>
}

export const InputLabel = forwardRef<HTMLDivElement, InputLabelProps>(
  ({ className, label, inputPlaceholder, inputId, inputType = 'text', error, inputProps, ...props }, ref) => {
    const id = inputId || `input-${label.toLowerCase().replace(/\s+/g, '-')}`
    
    return (
      <div ref={ref} className={cn('flex flex-col gap-m6', className)} {...props}>
        <Label htmlFor={id} className="typography-label-md text-text-primary lowercase">
          {label}
        </Label>
        <Input
          id={id}
          type={inputType}
          placeholder={inputPlaceholder}
          error={error}
          className="w-full"
          {...inputProps}
        />
      </div>
    )
  }
)

InputLabel.displayName = 'InputLabel'
