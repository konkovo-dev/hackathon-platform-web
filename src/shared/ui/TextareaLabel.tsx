import { cn } from '@/shared/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'
import { Textarea } from './Textarea'
import type { TextareaProps } from './Textarea'
import { Label } from './Label'

export interface TextareaLabelProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  textareaPlaceholder?: string
  textareaId?: string
  error?: boolean
  textareaProps?: Omit<TextareaProps, 'id' | 'placeholder' | 'error' | 'className'>
}

export const TextareaLabel = forwardRef<HTMLDivElement, TextareaLabelProps>(
  (
    { className, label, textareaPlaceholder, textareaId, error, textareaProps, ...props },
    ref
  ) => {
    const id = textareaId || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <div ref={ref} className={cn('flex flex-col gap-m6', className)} {...props}>
        <Label htmlFor={id} className="typography-label-md text-text-primary lowercase">
          {label}
        </Label>
        <Textarea
          id={id}
          placeholder={textareaPlaceholder}
          error={error}
          className="w-full"
          {...textareaProps}
        />
      </div>
    )
  }
)

TextareaLabel.displayName = 'TextareaLabel'
