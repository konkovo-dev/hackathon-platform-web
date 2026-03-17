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
  fillHeight?: boolean
  textareaProps?: Omit<TextareaProps, 'id' | 'placeholder' | 'error' | 'className' | 'fillHeight'>
}

export const TextareaLabel = forwardRef<HTMLDivElement, TextareaLabelProps>(
  (
    { className, label, textareaPlaceholder, textareaId, error, fillHeight = false, textareaProps, ...props },
    ref
  ) => {
    const id = textareaId || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-m6', fillHeight && 'flex-1 min-h-0', className)}
        {...props}
      >
        <Label htmlFor={id} className={cn('typography-label-md text-text-primary lowercase', fillHeight && 'shrink-0')}>
          {label}
        </Label>
        <Textarea
          id={id}
          placeholder={textareaPlaceholder}
          error={error}
          fillHeight={fillHeight}
          className="w-full"
          {...textareaProps}
        />
      </div>
    )
  }
)

TextareaLabel.displayName = 'TextareaLabel'
